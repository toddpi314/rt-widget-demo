import React from 'react';
import { createRoot } from 'react-dom/client';
import { MedalsWidget } from '@rt/widget-medals';

const container = document.getElementById('widget-container');
const root = createRoot(container);
root.render(
  <div className="app-container">
    <MedalsWidget title="Embedded Widget">
      <div>Embedded widget content</div>
    </MedalsWidget>
  </div>
); 