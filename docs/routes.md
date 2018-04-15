# Overview of routes

An overview of all the available endpoints, separated by file.

## app.js

### `GET /`

Main page, redirects to /section/1dry

## sections.js

### `GET /section/:section`

Returns the HTML for the specified section. Note that every section has a three letter word appended to the section name, to prevent switching from section to section.


### `GET /section/:section/initial`

Returns the first lesson of the section's module in JSON.

## verify.js

### `POST /verify`

Takes a JSON object with these fields:

- `module` - The problem module that the user is doing
- `name` - The name of the problem that the user is doing
- `author` - The JS generated authorID number
- `milliseconds` - How long in milliseconds the user took in answering the question
- `code` - The submitted code.

If all these fields are not present, returns a 400 error. If they are present, then it will attempt to verify the code given, and automatically log the result of the verification process. The verification process first checks for trivial answers. If it finds some, it will return a JSON object with these fields:

- `status` - With value "trivial"
- `lines` - An array of objects, each containing two fields: `lineNum` and `status`

Next, it will send the code to the RESOLVE verifier, which first checks if it is parsable. If it is not parsable, it will return a JSON object with this field:

- `status` - With vale "unparsable"

If the code contains no trivials and is parsable, the RESOLVE verifier will attempt to extract VCs and prove them. Once it does that, it sends back all the information to the beginToReason backend. If all of the VCs are proven, then it returns a JSON object with these fields:

- `status` - With value "success"
- `lines` - An array of objects, each containing two fields: `lineNum` and `status`
- `problem` - The next problem for the user to do

If some of the VCs are not proven, then it returns a similar JSON object, except that the `problem` field is omitted if there is no branching problem to do, and the user is meant to repeat the same problem. In addition, the `status` field is set to "failure".

## admin.js

### `GET /admin`

Redirects to /admin/overview

### `GET /admin/overview`

Entry point for the admin console

