import React from 'react';
import ReactDOM from 'react-dom/client';
import MedalsWidget, { MedalsWidgetProps } from '../MedalsWidget';
import { logger } from '../utils/logger';

// Initialize React in the window context
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

class MedalsWidgetElement extends HTMLElement {
  private root: any = null;
  private mountPoint: HTMLDivElement | null = null;
  private observer: MutationObserver | null = null;

  static get observedAttributes() {
    return ['title', 'element_id'];
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
          display: block;
        }
        .rt-widget-mount {
          display: block;
        }
      `;
      this.shadowRoot!.appendChild(style);
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
    this.render();
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

  private render() {
    if (!this.root) {
      logger.log('No root available for rendering');
      return;
    }

    const title = this.getAttribute('title') || 'Medals Widget';
    const element_id = this.getAttribute('element_id');
    const content = this.getChildContent();
    logger.log('Rendering with content:', content);

    this.ensureVisible();
    
    const props: MedalsWidgetProps = {
      element_id: element_id || 'medals-widget',
      children: React.createElement('div', {
        className: 'rt-widget-content',
        'data-testid': 'rt-widget-content',
        dangerouslySetInnerHTML: { __html: content }
      })
    };

    this.root.render(
      React.createElement(MedalsWidget, props)
    );
  }
}

if (!(window as any).customElements.get('medals-widget')) {
  customElements.define('medals-widget', MedalsWidgetElement);
} 