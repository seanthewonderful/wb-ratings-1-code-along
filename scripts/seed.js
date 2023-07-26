import { Movie, Rating, User, db } from '../src/model.js';
import movieData from './data/movies.json' assert { type: 'json' };
import lodash from 'lodash'

console.log('Syncing database...');
await db.sync({ force: true });

console.log('Seeding database...');

const moviesInDB = await Promise.all(movieData.map(async (movie) => {
    const releaseDate = new Date(Date.parse(movie.releaseDate));
    const { title, overview, posterPath } = movie;
  
    const newMovie = Movie.create({
      title,
      overview,
      posterPath,
      releaseDate,
    });
  
    return newMovie;
  })
);

const emails = []
let i = 0
while (i < 10) {
    emails.push(`user${i}@test.com`)
    i ++ 
}

const usersInDB = await Promise.all(emails.map(async (userEmail) => {
    const newUser = User.create({
        email: userEmail,
        password: 'test',
    })

    return newUser
}))

const ratingsInDB = await Promise.all(
    usersInDB.flatMap((user) => {
      // Get ten random movies
      const randomMovies = lodash.sampleSize(moviesInDB, 10);
  
      // Create a rating for each movie
      const movieRatings = randomMovies.map((movie) => {
        return Rating.create({
          score: lodash.random(1, 5),
          userId: user.userId,
          movieId: movie.movieId,
        });
      });
  
      return movieRatings;
    }),
  );
  
console.log(moviesInDB[0]);
console.log(usersInDB[0]);
console.log(ratingsInDB[0]);


await db.close()
console.log("Finished seeding the database")

