# Overview of routes

## app.rb

### `GET /`

Main page, redirects to /section1---

## problems.rb

### `GET /sectionx---`

Various verses of the tool for the students to do

### `GET /problems/:module/:problem`

Gets all the data required for the client side to display the problem

### `GET /problems/:module/:problem/code`

Deprecated. Gets the code of the problem. This is now included in the above route.

### `GET /problems/:module/:problem/previous`

Gets the previous problem.

### `GET /problems/:module/:problem/success`

Gets the next problem on success.

### `GET /problems/:module/:problem/failure`

Gets the next problem on failure.

## verify.rb

### `POST /verify`

Takes a json string with these fields:

* authorID - The integer ID assigned to the attempt, created by the client JS.
* seconds - The number of seconds the user took to make the attempt.
* code - The code of the user's attempt.

The route then submits the code to the verification engine, and sends back a response to the client with these fields:

* status - Either "success" or "failure".
* message - If failure, then the reason why. If success, this field is absent.
* problem - An object containing the next problem.

When completed, this route will deprecate the `log` route and most of the `problem` routes.

## log.rb

### `POST /log`

A route for the client-side JS to post to. This will be deprecated in the future, when the server side handles all the interaction with the verification engine.

## admin.rb

### `GET /admin`

Redirects to /admin/overview

### `GET /admin/overview`

Entry point for the admin console

