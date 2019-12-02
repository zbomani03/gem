## Installation

While using VS Code or Webstorm, use the terminal to install and compile the NodeJS application.

Run `npm install`.  This will pull down the particular packages.  

Running the application after installation of node_modules:
```
npm run dev
```

Once this is running on localhost:8080, you can call the API without the ability to hit breakpoints.

If you need to watch breakpoints and step through the code, add the following launch.json.

```
    {
        "type": "node",
        "request": "attach",
        "name": "Attach by Process ID",
        "processId": "${command:PickProcess}",
        "protocol": "inspector"
    }
```

Press F5, a dropdown will show up, and the first selection in the dropdown says node.  Press enter and debugging can occur if breakpoints are in place.

There are Postman examples exist inside of the examples folders.  Reference these in order to call the API.