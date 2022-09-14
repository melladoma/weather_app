# weather_app

A weather app website to track weather in real time in your favorites cities.
Coded in JS + Boostrap, backend built with Express + EJS for view templates, weather informations are fetched from OpenWeatherMap API and stored within a MongoDB database.

Users can sign up to access to the interactive map and search for their favorites cities.
Users credentials verification and validation is performed upon sign-in.
Cities can be added to the displayed results via search bar or by clicking on the map.
Their city list is kept through navigation thanks to sessions variables mecanism.
Markers are generated by a frontend script based on datas sent by the backend through HTML data attributes.

## Stack

- Node
- Express (MVC architecture)
- Javascript
- EJS
- MongoDB and Mongoose
- Bootstrap
- OpenWeatherMap API
- Leaflet library for interactive map

## Preview

Homepage : sign-in and sign-up
![weather_signup](https://user-images.githubusercontent.com/99024395/189925570-c18a7be4-39cd-42f7-8e9c-c79208123b54.jpg)

Cities search
![weather_cities](https://user-images.githubusercontent.com/99024395/189925625-3367bcba-38b9-4f8f-8033-29a2d25f1a2a.jpg)
