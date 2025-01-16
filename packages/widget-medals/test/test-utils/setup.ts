// Suppress React 18 act() warnings
// These warnings are caused by React Testing Library internals and can be safely ignored
const originalError = console.error;
console.error = (...args) => {
    if (/Warning: ReactDOM.render is no longer supported/.test(args[0])) return;
    if (/Warning: `ReactDOMTestUtils.act` is deprecated/.test(args[0])) return;
    originalError.call(console, ...args);
}; 