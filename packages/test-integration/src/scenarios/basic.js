import React from 'react';
import { createRoot } from 'react-dom/client';
import { MedalsWidget } from '@rt/widget-medals';

const container = document.getElementById('widget-container');
const root = createRoot(container);
root.render(
  <MedalsWidget title="Basic Widget">
    <div>Basic widget content</div>
  </MedalsWidget>
); 