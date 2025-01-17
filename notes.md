# Notes from the developer (Todd Morrison)

This widget could be production ready as-is. This doesn't mean it is perfect, nor that I even have the criteria to know if it's ready to meet some business need. Instead, I focused on providing the baseline foundation for asserting, with evidence, what works and doesn't work. 

This platform/systems focus assumes endless iteration, and provides a stream of telemetry between the project and the business as the project evolves. The test scnearios cover the 95p browser/resolution scenarios, and the visual regression tests give a product owner a fast way to verify exactly what scenarios don't work in production if we decide to deploy.

The philosphy being: its better to know how we are right/wrong, than to always be right.

What this project does in its current form:

- Provides a basic widget using the common react runtime, to ensure lots of mobility for stablization, design, and feature development
- Packaging that allows for easy consumption in a variety of ways: JS, Web Components, Federated Modules, Script Tags, iframes, etc. The integration story is documented in the [Usage Guide](usage.md)
- Jest based unit tests to ensure the logic in functional requirements work at the component level
- Playwright based tests to ensure the widget actually mounts in consumer harnesses, and that basic functional requirements are met given the variation of native + runtime layer of concrete browsers
- The model is also designed to be extended by webpack teams, direclty as a federated modulue at build time.
- Visual regression tests to ensure the widget doesn't break in a variety of scenarios. This also serves as a stateful way to quickly identify regressions for the p95 browser/resolution scenarios. (see packages/test-integration/__snapshots__)


What I didn't focus on, but would be low hanging fruit now that we have a solid foundation:

- Localization
- Better network ingress error states (e.g. 404, 500, etc.)

Long-term:

- Move the overall build and packaging tech to a common package, so the development of comprehensive widgets can occur at scale with the same footprint.
