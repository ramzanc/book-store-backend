const request = require('supertest');
const express = require('express');
const app = express();
const bookController = require('../controllers/book.controller');

jest.mock('../models/book.model'); // Automatically mocks Book

const Book = require('../models/book.model');

app.use(express.json());
app.post('/books', bookController.postABook);
app.get('/books', bookController.getAllBooks);
app.get('/books/:id', bookController.getSingleBook);
app.put('/books/:id', bookController.UpdateBook);
app.delete('/books/:id', bookController.deleteABook);

describe('Book Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /books', () => {
        it('should create a book', async () => {
            const mockBook = { title: 'Test Book', save: jest.fn().mockResolvedValue(true) };
            Book.mockImplementation(() => mockBook);

            const res = await request(app)
                .post('/books')
                .send({ title: 'Test Book' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Book posted successfully');
        });
    });

    describe('GET /books', () => {
        it('should return all books', async () => {
            const books = [{ title: 'Book 1' }, { title: 'Book 2' }];
            Book.find.mockResolvedValue(books);
            Book.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(books) });

            const res = await request(app).get('/books');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe('GET /books/:id', () => {
        it('should return a single book', async () => {
            const book = { _id: '123', title: 'Book 1' };
            Book.findById.mockResolvedValue(book);

            const res = await request(app).get('/books/123');
            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe('Book 1');
        });

        it('should return 404 if book not found', async () => {
            Book.findById.mockResolvedValue(null);

            const res = await request(app).get('/books/123');
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Book not Found!');
        });
    });

    describe('PUT /books/:id', () => {
        it('should return 500 due to forced error', async () => {
            const res = await request(app)
                .put('/books/123')
                .send({ title: 'Updated Title' });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Server Error. Api for update book not working');
        });
    });

    describe('DELETE /books/:id', () => {
        it('should delete a book', async () => {
            const book = { _id: '123', title: 'Book to delete' };
            Book.findByIdAndDelete.mockResolvedValue(book);

            const res = await request(app).delete('/books/123');
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Book deleted successfully');
        });

        it('should return 404 if book not found', async () => {
            Book.findByIdAndDelete.mockResolvedValue(null);

            const res = await request(app).delete('/books/999');
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Book is not Found!');
        });
    });
});
