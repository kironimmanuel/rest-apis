# Contact API

#### Login, Register feature

#### GET, POST, PATCH & DELETE requests

#### Password hashing with bcryptjs

JSON web token (Lifetime 30 days)
All Keys Generator -> Encryption Key -> 256-bit

#### In Development
```sh
nodemon -> npm run dev
```

#### Docgen with Postman documentation (for Windows)

1. Export Postman documentation to local machine.
2. Download windows_amd64.exe [docgen by "thedevsaddam"](https://github.com/thedevsaddam/docgen/releases)
3. Postman documentation and docgen binary must be in the same folder
4. cmd cd into the folder and use either of the following commands (replace .json file name with yours)

   docgen build -i docs.json -o ~/Downloads/index.html

   windows_amd64 build -i docs.json -o index.html

docgen uses inline JavaScript and conflicts with helmet

1. format the index.html
2. in public folder create file and move the inline JavaScript there
3. index.html set script src to the new file

##### Pushing to Heroku

1. heroku login
2. heroku create myApp (git remote -v check path)
3. add env's in heroku GUI (preferred) or CLI with: heroku config:set NAME_OF_ENV=thevalue (Terminal may return errors for certain symbols)
4. git push heroku master
5. ???
6. profit

#### Heroku clone

heroku git:clone -a myApp
