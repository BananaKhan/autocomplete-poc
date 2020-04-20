# Autocomplete POC

This is simple autocomplete POC. On BE it uses an array of articles as source of data and just sends first 10 matches that it finds. No levenshtein distance is calculated, first 10 matches is served. Also uses user input based generated regexp, which is DOS waiting to happen. Definitely not production ready, but works as a sample.

I've used 'Lorem ipsum' and it's translation as source for articles array, so I would advise use of words 'lore', 'ple' or 'exp' as a starting point for testing. You could either select autocomplete with mouse or navigate using arrows and 'Tab/Enter' key.

## To launch this app you would need to execute

**npm install**

After which you would need to run either

**npm run start:dev**

Which would serve app on http://localhost:3000 while running webpack-dev-server and API server

or

**npm run build**

**npm run server**

Which would serve app on http://localhost:3001 while serving files from dist folder using express-static server
