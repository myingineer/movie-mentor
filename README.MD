## Disclaimer and Attribution

This API uses data from various publicly accessible websites for informational purposes. We make every effort to provide accurate and up-to-date information. If you believe any information provided by this API is inaccurate or infringing upon your rights, please contact us.

We provide attribution to the original sources of data where applicable, and we encourage users to visit those sources for more detailed information.


## Terms of Use and Copyright Notice

Please be aware that the data provided by this API may be subject to terms of use and copyright restrictions imposed by the original content providers. It is your responsibility to review and comply with those terms when using the data from this API.

We encourage users to visit the original websites and review their terms of use and copyright policies for more information.

## What This Repo/Api Does

This is just a basic API for a movie website. It is a great api for a frontend developer to start working with real-life projects.

The api enables one to download movies majorly.

## Tools and Technologies Used

This api was built using Node Js, Express Js and Mongo Db

The are all free versions so expect some server timeout error at some point as I am hosting this on a serveless platform (Vercel)

## API USAGE

Here, the methods and usage of the api are as follows.

## All Endpoints
1 - https://myingineer-movie-mentor.vercel.app/ (GET)
2 - https://myingineer-movie-mentor.vercel.app/api/v1/movies (GET)
3 - https://myingineer-movie-mentor.vercel.app/api/v1/movies/:id (GET)
4 - https://myingineer-movie-mentor.vercel.app/api/v1/movies/search/:name (GET)
5 - https://myingineer-movie-mentor.vercel.app/api/v1/movies/highest-rated (GET)
6 - https://myingineer-movie-mentor.vercel.app/api/v1/users/signup (POST)
7 - https://myingineer-movie-mentor.vercel.app/api/v1/users/login (POST)
8 - https://myingineer-movie-mentor.vercel.app/api/v1/users/forgotPassword (POST)
9 - https://myingineer-movie-mentor.vercel.app/api/v1/users/resetPassword/:token (PATCH)

## General Overview

I am making use of JWT Authentication so in this case, the route on 2, 3,4 and 5 are protected.

Users or anyone who wants to access the endpoints 2,3,4 and 5 would have to use endpoint 6 to create an account. The user has to signup with username, emailAddress, password, confirmPassword. These are the required fields for signup and the username and emailAddress are unique fields. So do well to show the error while validating the form.

After a user has signed up, the user can now use endpoint 7 to login. When a user is logged in, a JWT is created for the user and also sent in the response. The JWT expires after an hour which the user would have to sign in again to get another JWT

When the user is logged in and the JWT is generated for that user, the JWT has to be sent along side the request headers before a user can access endpoints 2,3,4 and 5. The request header must come in Bearer Token format. That is {Authorization: Bearer JWT}.
The Bearer should start with B in uppercase and it should be seperated from the JWT by a space

With this, a user can access endpoints 2,3,4 and 5

## Each Endpoint
Endpoint 1 - just welcomes you to the api.


Endpoint 2 - Gives all the movies in the Database.


Endpoint 3 - Gives a detail and full overview about a movie based on it's ID.


Endpoint 4 - Helps you with a search bar. That is if you want to implement it in your website. The name parameter in the url basically takes any name or number and it would do a search and return all the movies with that specified name. Even if it's just a letter that comes in as the name parameter in the url, it would find all the movies that has that letter in the name and return it.


Endpoint 5 - Basically returns the top 5 higest rated movies in the response


Endpoint 6 - A POST request to signup a user. The required fields are username, emailAddress, password, confirmPassword


Endpoint 7 - A POST request to login a user. The login is done by username and password only. If user exists, it would return the JWT for that user in the response, alongside the username which can be used at hte top of the screen for the user (if needed);


Endpoint 8 - A POST request. This is used to reset the password and the user has to input his emailAddress in the request body. So you would be sending the emailAddress of the user to the db in ase of password reset and a link alongside a password reset token would be generated for that user and sent to the user's email for the user to reset the password


Endpoint 9 - This is a PATCH request that would be used to reset the password of the user. The link and the token goes to the user's mail so the link can only be accessed by that user from his/her mail. In the patch request the user has to specify password and confirmPassword before it can be changed. Also redirect the user back to the login page after this.


## QUERY PARAMETERS
All query parameters are only added on endpoint 2.

## First - Pagination and Limit
By default when you make a GET request on endpoint 2, you are on page 1 and the limit is 25. That means only 25 movies would come in the response

Page 2 would give the next 25 movies

To implement the pagination and limit 
?page=1&limit=5 This would give you 5 movies on page 1
?page=2&limit=9 This would run this calculation [(page - 1) * limit] and skip those movies before giving you just 9 movies on page 2

For a much easier and stress free usage,
just implement ?page=2 or ?page=3 or ?page=4 from a button that helps one navigate the pages. The calculation would be done automatically and for each page, you get 25 movies in the response based on what we have in the Database. 


## Second - Sorting
The movies are sorted according to when it was added to the database by default. You can sort it in your own way by using the sort query parameter and the name of the field. If it is more than 1, use comma ',' to seperate. i.e ?sort=ratings,releaseYear etc

## Third - Fields
By default all fields would show in the response, but you can decide the fields would want to see in the response by using the fields query parameter. It would return the data and show only the fields what was speicifed in the url. If you want more that one field, seperate it by comma ',' i.e ?fields=name,ratings,releaseYear This would return the movies and it would only show name,ratings and releaseYear in the response. Other fields would not show


CONTACT ME AT 
email- e.alexander190@yahoo.com