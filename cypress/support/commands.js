Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username: username,
    password: password,
  }).then(response => {
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(response.body));
    cy.visit('http://localhost:3001');
  });
});

Cypress.Commands.add('createUser', ({ name, username, password }) => {
  const user = {
    name: name,
    username: username,
    password: password,
  };
  cy.request('POST', 'http://localhost:3001/api/users/', user);
});

Cypress.Commands.add('createBlog', ({ title, author, url, likes = 0 }) => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem('loggedBlogAppUser')).token
      }`,
    },
  });

  cy.visit('http://localhost:3001');
});

Cypress.Commands.add('viewBlog', ({ title, author, url, likes }) => {
  cy.contains(title).parent().find('#view-hide-btn').as('theButton');
  cy.get('@theButton').should('contain', 'view');
  cy.get('@theButton').click();
  cy.get('@theButton').should('contain', 'hide');
  cy.contains(`${title} ${author}`);
  cy.contains(url);
  cy.contains(`Likes ${likes}`);
});
