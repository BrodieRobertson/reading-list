const host: string = "localhost"
const port: string = "8000"
const uri: string = `http://${host}:${port}`

/**
 * Generates the api path for books, if no id provided the path for all book will be returned
 * 
 * @param id The id of the book
 */
export function bookPath(id: string) {
    const path = uri + "/book"
    return (id ? path + "/" + id : path)
}

/**
 * Generates the api path for authors, if no id provided the path for all authors will be returned 
 * @param id The id of the author
 */
export function authorPath(id: string) {
    const path = uri + "/author"
    return (id ? path + "/" + id : path)
}

/**
 * Generates the api path for illustrators, if no id provided the path for all illustrators will be returned
 * @param id The id of the illustrator
 */
export function illustratorPath(id: string) {
    const path = uri + "/illustrator"
    return (id ? path + "/" + id : path)
}

/**
 * Generates the api path for the bookAuthors, if no bookId and no authorId provided the path 
 * for all bookAuthors will be returned
 * @param bookId The id of the book
 * @param authorId The id of the author
 */
export function bookAuthorPath(bookId: string, authorId: string) {
    var path = uri + "/bookauthor/"
    if(bookId) {
        path += bookId
    }

    path += "/"

    if(authorId) {
        path += authorId
    }

    return path
}

/**
 * Generates the api path for the bookIllustrators, if no bookId and no illustrator provided the path
 * for all bookIllustrators will be returned
 * @param bookId The id of the book
 * @param illustratorId  The id of the illustrator
 */
export function bookIllustratorPath(bookId: string, illustratorId: string) {
    var path = uri + "/bookillustrator/"

    if(bookId) {
        path += bookId
    }

    path += "/"

    if(illustratorId) {
        path += illustratorId
    }
    return path
}