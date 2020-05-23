const { hash } = require("bcryptjs");
const faker = require("faker");

const User = require("./src/app/models/User");
const Product = require("./src/app/models/Product");
const File = require("./src/app/models/File");

let usersIDs = [], productsIDs = [];
const totalUsers = 5;
const totalProducts = 15;
const totalFiles = 50;
const pass = "123";

async function createUsers() {
  try {
    let users = [];
    const password = await hash(`${pass}`, 8);

    while (users.length < totalUsers) {
      users.push({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        cpf_cnpj: faker.random.number(99999999999),
        cep: faker.random.number(99999999),
        address: faker.address.streetName()
      });
    }

    const usersPromise = users.map(user => User.create(user));
    usersIDs = await Promise.all(usersPromise);

  } catch (error) {
    console.error(error);
  }
}

async function createProducts() {
  try {
    let products = [], files = [];

    while (products.length < totalProducts) {
      products.push({
        category_id: Math.ceil(Math.random() * 3),
        user_id: usersIDs[Math.floor(Math.random() * totalUsers)],
        name: faker.name.title(),
        description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
        old_price: faker.random.number(99999),
        price: faker.random.number(9999),
        quantity: faker.random.number(99),
        status: Math.round(Math.random())
      });
    }

    const productsPromise = products.map(product => Product.create(product));
    productsIDs = await Promise.all(productsPromise);

    while (files.length < totalFiles) {
      files.push({
        name: faker.image.image(),
        path: `public/images/placeholder.png`,
        product_id: productsIDs[Math.floor(Math.random() * totalProducts)]
      });
    }

    for (let i = 1; i < products.length; i++) {
      let tot = 0;
      const lim = 5;

      files.forEach(file => {
        if (file.product_id == i) tot++;
        if (tot > lim) files.splice(files.indexOf(file), 1);
      });

      if (tot == 0) {
        files.push({
          name: faker.image.image(),
          path: `public/images/placeholder.png`,
          product_id: i
        });
      }
    }

    const filesPromise = files.map(file => File.create({ name: file.name, path: file.path.replace(/\\/g, "/"), product_id: file.product_id }));
    await Promise.all(filesPromise);

  } catch (error) {
    console.error(error);
  }
}

async function init() {
  await createUsers();
  await createProducts();
}

init();
