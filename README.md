# Smart Calendar Scheduler

Scheduling meetings over email is often time-consuming and repetitive. When someone asks, "When are you free to meet next week?", users typically have to switch tabs, check their calendar, and manually type out their availability. This workflow is especially inefficient for busy professionals managing multiple events. Our extension reduces this friction by automatically generating natural-language availability responses based on the user’s calendar, streamlining the scheduling process.

## Installation

### Install From Release

- Download the latest release from the [Releases](https://github.com/lukashchu/smart-email-calendar-scheduler/releases)
- Unzip the downloaded ZIP file
- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer mode"
- Drag and drop the unzipped folder into the extensions page

### Install From Source

1. Clone the repository:

   ```bash
   git clone https://github.com/lukashchu/smart-email-calendar-scheduler
   ```

2. Install dependencies:

   ```bash
   cd smart-email-calendar-scheduler
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load the extension in Chrome:

   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory from the project

## Development

- Run the development server with hot reloading:

  ```bash
  npm run dev
  ```

- Load the unpacked extension in Chrome from the `dist` directory
- Make changes to the source code and the extension will automatically reload

## Implemented Features



## Individual Contributions



## Known Issues and Future Work



The project was completed by a team of 4 students, [Andrew Lukashchuk](https://github.com/lukashchu), [Dewayne Barnes](https://github.com/evanition), [Sphia Sadek](https://github.com/isadeks), and [Nicholas Molina](https://github.com/ngmolina), on top of the template created with the previous attributions.
