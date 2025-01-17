import React from 'react';
import ReactDOM from 'react-dom/client';
import MedalsWidget from '../MedalsWidget';

class MedalsWidgetElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private mountPoint: HTMLDivElement | null = null;
  private observer: MutationObserver | null = null;

  static get observedAttributes() {
    return ['title'];
  }

  private async waitForDependencies() {
    console.log('Waiting for React and ReactDOM...');
    await new Promise<void>((resolve) => {
      const checkDeps = () => {
        if ((window as any).React && (window as any).ReactDOM) {
          console.log('React and ReactDOM available');
          resolve();
        } else {
          setTimeout(checkDeps, 100);
        }
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
          border: 2px solid red;
          padding: 15px;
          margin: 10px;
          border-radius: 4px;
        }
        .rt-widget-content {
          display: block !important;
          visibility: visible !important;
          margin-top: 10px;
          padding: 10px;
          border: 1px solid #ccc;
        }
        .rt-widget-title {
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 10px 0;
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
    console.log('Web component connected');
    
    // Wait for React and ReactDOM to be available
    await this.waitForDependencies();
    
    this.mountPoint = document.createElement('div');
    this.mountPoint.setAttribute('data-testid', 'rt-widget-mount');
    
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(this.mountPoint);

    // Set up mutation observer to watch for changes to children
    this.observer = new MutationObserver(() => {
      console.log('Content changed, re-rendering');
      this.render();
    });
    
    this.observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true
    });

    this.ensureVisible();
    this.root = (window as any).ReactDOM.createRoot(this.mountPoint);
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
    console.log('Attributes changed, re-rendering');
    this.render();
  }

  private render() {
    if (!this.root) {
      console.log('No root available for rendering');
      return;
    }

    const title = this.getAttribute('title') || 'Medals Widget';
    const content = this.getChildContent();
    console.log('Rendering with content:', content);

    this.ensureVisible();
    this.root.render(
      (window as any).React.createElement(MedalsWidget, {
        title,
        children: (window as any).React.createElement('div', {
          className: 'rt-widget-content',
          'data-testid': 'rt-widget-content',
          dangerouslySetInnerHTML: { __html: content }
        })
      })
    );
  }
}

if (!(window as any).customElements.get('medals-widget')) {
  customElements.define('medals-widget', MedalsWidgetElement);
} 