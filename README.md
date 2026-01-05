# TVMaze

This project is intended as a practice project for various techniques such as Vitest. It uses the TVMaze API as it's data source.

# Structure

The project uses a simple layered structure:

  * `/api` For all API related functionality such as the calls to the TVMaze API and the corresponding tests
  * `/assets` For all assets such as global stylesheets and images
  * `/components` For all components used in views
  * `/router` For Vue's router configuration
  * `/stores` For the various Pinia stores
  * `/types` For the domain, which consists of types
  * `/views` For the application's views/pages
  * `App.vue` The root component
  * `main.ts` For the configuration of Vue and the used libraries/frameworks

# Stack

The project uses the following stack:

* **Vue 3:** Front-end framework, using the composition API
* **Pinia:** State management
* **Vitest:** Unit-testing framework, using it's coverage- (V8) and UI utilities.
* **TypeScript**
* **Fetch API:** For API handling
* **FontAwesome:** As the icon library, using their own component

# How to run

The project has not been developed with the intent of deploying, therefore you need to run a local build using npm install to install dependencies and afterwards npm run dev to start a dev build.

This requires you to have a local .env that houses the VITE_TVMAZE_API_BASE variable, during the build the value https://api.tvmaze.com was used.

# Additional Commands

The project also supports unit testing using Vitest, linting using ESLint and formatting using Prettier. The following npm commands are available:

* `npm run lint` will run eslint with the flags --fix and --cache
* `npm run format` will run prettier with the flags --write --experimental-cli and on the entire project (src/)
* `npm run test:unit` will run Vitest with the flags --coverage and --ui, this enables the UI and adds coverage details both in the CLI and in the UI.