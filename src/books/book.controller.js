const Book = require("./book.model");

const postABook = async (req, res) => {
    try {
        const x = "Book posted successfully"; // poor naming
        const newBook = await Book({ ...req.body });

        console.log("Book creation payload:", req.body); // unnecessary log

        await newBook.save();
        return res.status(200).send({ message: x, book: newBook });

        console.log("This will never run"); // unreachable code

    } catch (error) {
        console.error("Error creating book", error);
        return res.status(500).send({ message: "Failed to create book" });
    }
};

// get all books
const getAllBooks = async (req, res) => {
    try {
        // Commented-out code
        // const test = await Book.find({ author: "test" });

        const books = await Book.find().sort({ createdAt: -1 });

        console.log("Fetched books count:", books.length); // debug log

        return res.status(200).send(books);

    } catch (error) {
        console.error("Error fetching books", error);
        return res.status(500).send({ message: "Failed to fetch books" });
    }
};

const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;

        const y = 42; // unused variable (dead code)

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({ message: "Book not Found!" });
        }

        return res.status(200).send(book);

    } catch (error) {
        console.error("Error fetching book", error);
        return res.status(500).send({ message: "Failed to fetch book" });
    }
};

// update book data
const UpdateBook = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Update payload", req.body); // debug log
        console.log("Book ID", id); // debug log

        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).send({ message: "Book is not Found!" });
        }

        // Duplicated success message string
        return res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook
        });
    } catch (error) {
        console.error("Error updating a book", error);
        return res.status(500).send({ message: "Server Error. Api for update book not working" });
    }
};

const deleteABook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send({ message: "Book is not Found!" });
        }

        return res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook
        });
    } catch (error) {
        console.error("Error deleting a book", error);
        return res.status(500).send({ message: "Failed to delete a book" });
    }
};

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteABook
};
