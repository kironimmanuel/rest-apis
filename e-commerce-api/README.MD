# E-Commerce API

### (GET, POST, PATCH, DELETE)

##### For implementing a e-commerce backend

###### Nodemon

```sh
npm run dev
```

###### Docgen with Postman documentation (for Windows)

1. Export Postman documentation to local machine.
2. Download windows_amd64.exe [docgen by "thedevsaddam"](https://github.com/thedevsaddam/docgen/releases)
3. Postman documentation and docgen binary must be in the same folder
4. cmd cd into the folder and use either of the following commands (replace .json file name with yours)

###### CMD

```sh
   docgen build -i docs.json -o ~/Downloads/index.html

   windows_amd64 build -i docs.json -o index.html
```

###### docgen uses inline JavaScript and conflicts with helmet

1. format the index.html
2. in public folder create file and move the inline JavaScript there
3. index.html set script src to the new file
