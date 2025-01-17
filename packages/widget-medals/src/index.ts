/**
 * Medal Widget Package Entry Point
 * 
 * This module serves as the main entry point for the Medal Widget package,
 * providing exports for both direct React component usage and loader-based
 * integration.
 * 
 */

export { default as MedalsWidget } from './MedalsWidget';
export type { MedalsWidgetProps as RTWidgetMedalsProps } from './MedalsWidget';
export { default } from './loader';