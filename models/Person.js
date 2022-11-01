const mongoose = require('mongoose')

const Person = mongoose.model('Person',{    //"Person" é a convenção; ele vai usar sempre o plural do que eu escrever aqui
    name: String,
    salary: Number,
    approved: Boolean,
})

module.exports = Person

