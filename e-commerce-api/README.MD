# E-Commerce API

#### Security packages

express-rate-limiter: Limit requests made from each IP address
helmet: Set's security related http response headers
xss-clean: Sanitize user inputs
express-mongo-sanitize: Protects against mongoDB injection
cors: Allows access from different domains, only works if our frontend is on the same domain

#### In Development

nodemon -> npm run dev

#### Docgen with Postman documentation (for Windows)

1. Export Postman documentation to local machine.
2. Download windows_amd64.exe [docgen by "thedevsaddam"](https://github.com/thedevsaddam/docgen/releases)
3. Postman documentation and docgen binary must be in the same folder
4. cmd cd into the folder and use either of the following commands (replace .json file name with yours)

   docgen build -i Postman-documentation.json -o ~/Downloads/index.html

   windows_amd64 build -i Postman-documentation.json -o index.html

5. docgen uses inline JavaScript and conflicts with helmet, alternative is setting

##### Pushing to Heroku

1. heroku login
2. heroku create myApp (git remote -v check path)
3. add env's in heroku GUI (preferred) or CLI with: heroku config:set NAME_OF_ENV=thevalue (Terminal may return errors for certain symbols)
4. git push heroku master
5. ???
6. profit

#### Heroku clone

heroku git:clone -a myApp
