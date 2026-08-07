// TBD: npm ci depends upon pkg lock and pkg json sync - beneficial in dev ops

import { Book, BookKeys, BookStatus } from "./index.types.ts";

// signature of the function that prints book info
function printBooksInfo(books: Book[]) {
  for (const book of books) {
    console.log(`Book: ${book["title"]}\n`);
    for (const key in book) {
      // code smell and techincal debt if using strings for comparisons
      // if (book[key as BookKeys] === BookStatus.Available) {
      // do something
      // }

      // as = alias is used to tell ts that we know the type of the key = order to ts
      // satisfies the type checker that we know what we are doing = request from ts
      console.log(`${key}: ${book[key as BookKeys]}`);
    }
    console.log("\n--------------------\n");
  }
}

// ?? = null coalescing operator
// || = circuit breaker operator

// Mr X is issuing two books
const myBooks: Book[] = [
  // this is a json object = javascipt object notation
  {
    title: "The Great Gatsby",
    pages: 180,
  },
  {
    title: "1984",
    pages: 328,
  },
  {
    title: "To Kill a Mockingbird",
    pages: 281,
    status: BookStatus.Available,
    summary: "A novel about the serious issues of racial inequality.",
    body: "",
  },
] satisfies Book[]; // type assertion

printBooksInfo(myBooks);

// node does typestripping for running ts files so it doesnt throw any ts errors at runtime

// transpiling means converting source to source code = ts to js
// compiling means converting source to machine code = ts to 1s and 0s or assembly
