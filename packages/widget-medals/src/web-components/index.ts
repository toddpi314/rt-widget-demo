/**
 * Medal Widget Web Component
 * 
 * This module provides a Web Component wrapper around the Medal Widget React component,
 * allowing it to be used directly in HTML with custom element syntax. It handles all the
 * necessary setup and lifecycle management for integrating a React component into a Web
 * Component context.
 * 
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import MedalsWidget, { MedalsWidgetProps } from '../MedalsWidget';
import { logger } from '../utils/logger';
import { SortField } from '../hooks/useMedalData';

// Initialize React in the window context
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

class MedalsWidgetElement extends HTMLElement {
  private root: any = null;
  private mountPoint: HTMLDivElement | null = null;
  private observer: MutationObserver | null = null;

  static get observedAttributes() {
    return ['element_id', 'sort'];
  }

  private async waitForDependencies() {
    logger.log('Waiting for React and ReactDOM...');
    return new Promise<void>((resolve) => {
      const checkDeps = () => {
        if ((window as any).React?.useState && (window as any).ReactDOM?.createRoot) {
          logger.log('React and ReactDOM available with required features');
          resolve();
          return;
        }
        setTimeout(checkDeps, 100);
      };
      checkDeps();
    });
  }

  private ensureVisible() {
    const styleId = 'rt-widget-medals-styles';
    if (!this.shadowRoot!.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        :host {
          display: block !important;
          visibility: visible !important;
          min-height: 100px !important;
          height: auto !important;
          opacity: 1 !important;
        }
        .rt-widget {
          display: block !important;
          visibility: visible !important;
          min-height: 100px !important;
          height: auto !important;
          opacity: 1 !important;
          position: relative !important;
          z-index: 1 !important;
          padding: 15px;
          margin: 10px;
          border-radius: 4px;
        }
        .rt-widget-content {
          display: block !important;
          visibility: visible !important;
          margin-top: 10px;
          padding: 10px;
        }
        .rt-widget-title {
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 10px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          display: table !important;
          visibility: visible !important;
        }
        thead {
          display: table-header-group !important;
          visibility: visible !important;
        }
        tbody {
          display: table-row-group !important;
          visibility: visible !important;
        }
        tr {
          display: table-row !important;
          visibility: visible !important;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
          display: table-cell !important;
          visibility: visible !important;
        }
        th {
          font-weight: bold;
          cursor: pointer;
        }
        th:hover {
          background-color: #f5f5f5;
        }
        tbody tr:hover {
          background-color: #f5f5f5;
        }
        .rt-widget-wrapper {
          display: block !important;
          visibility: visible !important;
          min-height: 100px !important;
          height: auto !important;
          opacity: 1 !important;
        }
      `;
      this.shadowRoot!.appendChild(style);
    }

    if (this.mountPoint) {
      this.mountPoint.style.cssText = `
        display: block !important;
        visibility: visible !important;
        min-height: 100px !important;
        height: auto !important;
        opacity: 1 !important;
      `;
    }
  }

  private getChildContent() {
    // Get all child nodes and convert them to an array
    const childNodes = Array.from(this.childNodes);
    
    // Filter out text nodes that are just whitespace
    const contentNodes = childNodes.filter(node => 
      node.nodeType !== Node.TEXT_NODE || node.textContent?.trim()
    );
    
    // If there's only one text node, return its content directly
    if (contentNodes.length === 1 && contentNodes[0].nodeType === Node.TEXT_NODE) {
      return contentNodes[0].textContent || '';
    }
    
    // Otherwise, create a div with the content
    const contentHtml = contentNodes.map(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      return (node as Element).outerHTML;
    }).join('');

    return contentHtml;
  }

  async connectedCallback() {
    logger.log('Web component connected');
    
    this.mountPoint = document.createElement('div');
    this.mountPoint.setAttribute('data-testid', 'rt-widget-mount');
    
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(this.mountPoint);

    await this.waitForDependencies();
    
    this.root = ReactDOM.createRoot(this.mountPoint);

    this.observer = new MutationObserver(() => {
      logger.log('Content changed, re-rendering');
      this.render();
    });
    
    this.observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true
    });

    this.ensureVisible();
    await this.render();
    
    // Wait for initial render to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.root) {
      this.root.unmount();
    }
  }

  attributeChangedCallback() {
    logger.log('Attributes changed, re-rendering');
    this.render();
  }

  private async render() {
    if (!this.root) {
      logger.log('No root available for rendering');
      return;
    }

    const element_id = this.getAttribute('element_id');
    const rawSort = this.getAttribute('sort');
    const sort = (rawSort === 'total' || rawSort === 'gold' || rawSort === 'silver' || rawSort === 'bronze') ? rawSort as SortField : undefined;
    const content = this.getChildContent();
    logger.log('Rendering with content:', content);

    this.ensureVisible();
    
    const props: MedalsWidgetProps = {
      element_id: element_id || 'medals-widget',
      sort,
      children: React.createElement('div', {
        className: 'rt-widget-content',
        'data-testid': 'rt-widget-content',
        'data-sort-order': this.getAttribute('sort-order') || 'desc',
        dangerouslySetInnerHTML: { __html: content }
      })
    };

    // Ensure the mount point is empty
    if (this.mountPoint) {
      while (this.mountPoint.firstChild) {
        this.mountPoint.removeChild(this.mountPoint.firstChild);
      }
    }

    this.root.render(
      React.createElement(MedalsWidget, props)
    );

    // Wait for render to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

if (!(window as any).customElements.get('medals-widget')) {
  customElements.define('medals-widget', MedalsWidgetElement);
} 