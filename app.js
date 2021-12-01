const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())
const connect = () => {
  return mongoose.connect(
    'mongodb+srv://kapoorkartik:2jhAiBXJCU26Lg4@cluster0.lkd0p.mongodb.net/library?retryWrites=true&w=majority',
  )
}

//----------------- Section Collection --------------
const sectionSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const Section = mongoose.model('section', sectionSchema)

//----------- Books Collection -------------
const bookSchema = new mongoose.Schema(
  {
    book_name: { type: String, required: true },
    body: { type: String, required: true },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'section',
      required: true,
    },
    authors_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'author',
        required: true,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const Book = mongoose.model('book', bookSchema)

//---------- Author Collection --------------
const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const Author = mongoose.model('author', authorSchema)

//----------- Checkout Collection -----------------
const checkoutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'book',
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const Checkout = mongoose.model('chekout', checkoutSchema)

/*-----------------CRUD for Section---------------------*/

app.post('/sections', async (req, res) => {
  try {
    const section = await Section.create(req.body)
    return res.send(section)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

app.get('/sections', async (req, res) => {
  try {
    const section = await Section.find().lean().exec()
    return res.send(section)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

app.get('/sections/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).lean().exec()
    return res.send(section)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})
/*
 try{
 
 }catch(e){
      return res.status(500).json({ message: e.message, status: "Failed" })
      }
 */
app.patch('/sections/:id', async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    return res.send(section)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

app.delete('/sections/:id', async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id).lean().exec()
    return res.send(section)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

/*-----------------CRUD for Author---------------------*/
/*
  Template :-
 try{
 
 }catch(e){
      return res.status(500).json({ message: e.message, status: "Failed" })
      }
 */

//Post
app.post('/authors', async (req, res) => {
  try {
    const author = await Author.create(req.body)

    return res.status(201).send(author)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

//Get All
app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.find().lean().exec()

    return res.send(authors)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

//Get One
app.get('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)

    return res.send(author)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

//Patch
app.patch('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    return res.send(author)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

//Delete

app.delete('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id)

    return res.send(author)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})
/*-----------------CRUD for Books---------------------*/

//POST
app.post('/books', async (req, res) => {
  try {
    const book = await Book.create(req.body)

    return res.send(book)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})


app.post('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body ,{new : true})

    return res.send(book)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})
//GET
app.get('/books', async (req, res) => {
  try {
    const book = await Book.find()
      .populate({ path: 'section_id', select: 'section' })
      .populate({ path: 'authors_id', select: 'name' })
      .lean()
      .exec()

    return res.send(book)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

/*-----------------CRUD for CheckOut---------------------*/

app.post('/checkout', async (req, res) => {
  try {
    const checkout = await Checkout.create(req.body)

    return res.send(checkout)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})

// find all books that are checkout 

app.get('/checkout', async (req, res) => {
  try {
    const checkout = await Checkout.find().populate("book_id").lean().exec()
    // console.log(checkout)

    return res.send(checkout)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 'Failed' })
  }
})


//find all books written by an author

app.get('/books/authors/:id', async (req,res)=>{

    try {
const books = await Book.find({authors_id : req.params.id})
    .populate({ path: 'section_id', select: 'section' })
    .populate({ path: 'authors_id', select: 'name' })
    .lean()
    .exec()
return res.send(books)

    }catch(e){
    return res.status(500).json({message : e.message , status : "Failed"})
    }
})


//find books in a section
    app.get('/books/sections/:id',async (req,res)=>{
    try {
    const books = await Book.find({section_id : req.params.id})
    .populate({ path: 'section_id', select: 'section' })
    .populate({ path: 'authors_id', select: 'name' })
    .lean()
    .exec()
return res.send(books)
    }catch(e) {
        return res.status(500).json({message : e.message , status : "Failed"})
    }
    })
    
    //find books of author inside a section 
    
    app.get('/books/:section_id/:author_id',async (req,res)=>{
    try{
        const books = await Book.find({section_id : req.params.section_id , auhors_id : req.params.authors_id})
    .populate({ path: 'section_id', select: 'section' })
    .populate({ path: 'authors_id', select: 'name' })
    .lean()
    .exec()
    return res.send(books)
    }catch(e) {
        return res.status(500).json({message : e.message , status : "Failed"})
    }
    
    })


//find all books that are not checkedout

    app.get('/books/not_checkout', async (req,res) =>{
        
        try{
        const all_books = await Book.find().lean().exec();
        const checkout_books = await Checkout.find()
        .populate({path: 'book_id', select : "book_name"})
        .lean()
        .exec();
        
        const not_checkout_books = [];
          for (let i = 0 ; i < all_books.length ; i++){
           // console.log('all_books',all_books[i]._id)
           let ans = 0
           for (let j = 0 ; j < checkout_books.length ; j++){
             //console.log('checkout_books',checkout_books[j].book_id)
   if (all_books[i].book_name == checkout_books[j].book_id.book_name){
             ans = 1
          }
       
       }
       if (ans === 0) {
       not_checkout_books.push(all_books[i])
       }
       
   }
       res.send(not_checkout_books)
        
        }catch(e) {
        return res.status(500).json({message : e.message , status : "Failed"})
         }
    
    })
    
    
    
    
    
    
/*----------------Listening to port 1234----------------*/

app.listen(1234, async () => {
  await connect()
  console.log('Listening to port 1234')
})
