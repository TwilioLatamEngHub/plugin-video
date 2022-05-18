# Twilio Video for Twilio Flex

The Twilio Vifro for Twilio Flex plugin allows you to use a video channel and render it within a Flex window. Another feature that this plugin can do is use the Twilio video processor to add video background in the agent view.

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

## Setup

### Requirements

To deploy this plugin, you will need:
- An active Twilio account with Flex provisioned. Refer to the [Flex Quickstart](https://www.twilio.com/docs/flex/quickstart/flex-basics#sign-up-for-or-sign-in-to-twilio-and-create-a-new-flex-project) to create one
- Node version 10.12.0 or later installed (type `node -v` in your terminal to check)
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli) along with the [Flex CLI Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins) * Run the following commands to install them:

```bash
brew tap twilio/brew && brew install twilio
```

Finally, install the [Flex Plugin extension](https://github.com/twilio-labs/plugin-flex/tree/v1-beta) for the Twilio CLI:

```bash
twilio plugins:install @twilio-labs/plugin-flex
```
   
### Configure your Flex Workspace

In order to use this plugin, you need to prepare your **Flex TAsk Assignment** workspace.

### Retrieve your Flex settings

Navigate to your Flex project in the [Twilio Console](https://www.twilio.com/console). Copy your **Account Sid** and **Auth Token**, and create a new Twilio CLI profile using those credentials and activate it.

```
twilio profiles:create
You can find your Account SID and Auth Token at https://www.twilio.com/console
 » Your Auth Token will be used once to create an API Key for future CLI access to your Twilio Account or Subaccount, and then forgotten.
? The Account SID for your Twilio Account or Subaccount: ACxxx
? Your Twilio Auth Token for your Twilio Account or Subaccount: [hidden]

? Shorthand identifier for your profile: whatsappmmsforflex
Created API Key SKxxx and stored the secret in your keychain.
Saved whatsappmmsforflex.

twilio profiles:use whatsappmmsforflex
```

Keep in mind that this account will be used for the rest of the deployment. In order to switch accounts, use the command `twilio profiles:use <different_profile>`.


Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com). We support Node >= 10.12 (and recommend the _even_ versions of Node). Afterward, install the dependencies by running `npm install`:

Next, please install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) by running:

```bash
brew tap twilio/brew && brew install twilio
```

Finally, install the [Flex Plugin extension](https://github.com/twilio-labs/plugin-flex/tree/v1-beta) for the Twilio CLI:

```bash
twilio plugins:install @twilio-labs/plugin-flex
```

## Development

Before explaining how to run the plugin, we need to explain how it works.
The video processor library works using Tensor Flow files, and for the plugin to work correctly, we need to provide these files to JS files that will use it. When we do run the plugin locally and add these files to a public folder, it works fine, the problem is when we do the deploy to the Flex environment. 

To solve this we create an index.js file that contains a simple web server that provides these files to the web, but you will need to expose the PORT to the web and change the URL to the plugin can to get these files.

Run `twilio flex:plugins --help` to see all the commands we currently support. For further details on Flex Plugins refer to our documentation on the [Twilio Docs](https://www.twilio.com/docs/flex/developer/plugins/cli) page.

## Local Development

As you probably saw before on the command `twilio flex:plugins --help`, to run the plugin you need to just run the command below:

```bash
    twilio flex:plugins:start
```

## Deploy

To deploy the plugin, you need to run the command `twilio flex:plugins:deploy` but you will need to add some flags to it works. 

For more information about it, take a look at [this](https://www.twilio.com/docs/flex/developer/plugins/cli/deploy-and-release) documentation that will explain all things that you should know about the Flex Plugins deploy process.

## Enable Background 

To enable the background feature, you need to uncomment the environment variable on the .env file and complete the background URL inside this variable.

