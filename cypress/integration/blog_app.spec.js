describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      name: 'James Bond',
      username: '007',
      password: 'erittainsalainen',
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user);
    cy.visit('http://localhost:3001');
  });

  it('Login from is shown', function () {
    cy.contains('log in to application');
    cy.contains('username');
    cy.contains('password');
    cy.get('#login-btn').should('be.visible');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username-input').type('007');
      cy.get('#password-input').type('erittainsalainen');
      cy.get('#login-btn').click();

      cy.contains('James Bond is logged in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('login').click();
      cy.get('#username-input').type('jb007');
      cy.get('#password-input').type('wrong');
      cy.get('#login-btn').click();

      cy.get('#error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'none');

      cy.get('html').should('not.contain', 'James Bond logged in');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: '007', password: 'erittainsalainen' });
    });

    it('A blog can be created', function () {
      cy.get('#create-btn').click();
      cy.get('#title').type('a cypress test blog');
      cy.get('#author').type('cypress tester');
      cy.get('#url').type('http://cy-testing.com');
      cy.get('.createBtn').click();
      cy.contains('a cypress test blog cypress tester');
    });

    describe('and several blogs exists', function () {
      const blog1 = {
        title: 'first blog',
        author: 'writer1',
        url: 'url1',
        likes: 1,
      };
      const blog2 = {
        title: 'second blog',
        author: 'writer2',
        url: 'url2',
        likes: 0,
      };
      const blog3 = {
        title: 'third blog',
        author: 'writer3',
        url: 'url3',
        likes: 2,
      };

      beforeEach(function () {
        cy.createBlog(blog1);
        cy.createBlog(blog2);
        cy.createBlog(blog3);
      });

      it('full info of one of those can be view', function () {
        cy.contains('first blog')
          .parent()
          .find('#view-hide-btn')
          .as('ViewHideButton');
        cy.get('@ViewHideButton').should('contain', 'view');
        cy.get('@ViewHideButton').click();
        cy.get('@ViewHideButton').should('contain', 'hide');
        cy.contains('first blog writer1');
        cy.contains('url1');
        cy.contains('Likes 1');
        cy.contains('James Bond');
      });

      it('one of those can be liked by any user', function () {
        // blog owner can like
        cy.viewBlog(blog2);
        cy.contains(blog2.title).parent().find('#likes').as('LikesDiv');
        cy.get('@LikesDiv').contains(`Likes ${blog2.likes}`);
        cy.contains(blog2.title).parent().find('#like-btn').as('LikeButton');
        cy.get('@LikeButton').click();
        cy.get('@LikesDiv').contains(`Likes ${blog2.likes + 1}`);

        // another user can like
        // first logout
        cy.get('#logout-btn').click();
        // create another user and login
        cy.createUser({
          name: 'Doctor No',
          username: 'DrNo',
          password: 'tosisalainen',
        });
        cy.login({ username: 'DrNo', password: 'tosisalainen' });
        // a blog can be liked
        cy.viewBlog(blog3);
        cy.contains(blog3.title).parent().find('#likes').as('LikesDiv');
        cy.get('@LikesDiv').contains(`Likes ${blog3.likes}`);
        cy.contains(blog3.title).parent().find('#like-btn').as('LikeButton');
        cy.get('@LikeButton').click();
        cy.get('@LikesDiv').contains(`Likes ${blog3.likes + 1}`);
        // but liking does not give access to remove the blog
        cy.contains(blog3.title)
          .parent()
          .find('#remove-btn')
          .should('not.exist');
      });

      it('one of those can be removed by owner user', function () {
        cy.contains(`${blog3.title} ${blog3.author}`);
        cy.viewBlog(blog3);
        cy.contains(blog3.title).parent().find('#remove-btn').should('exist');
        cy.contains(blog3.title)
          .parent()
          .find('#remove-btn')
          .as('RemoveButton');
        cy.get('@RemoveButton').click();
        cy.contains(`${blog3.title} ${blog3.author}`);
      });

      it('one of those can not be removed by another user', function () {
        // first logout
        cy.get('#logout-btn').click();
        // create another user and login
        cy.createUser({
          name: 'Doctor No',
          username: 'DrNo',
          password: 'tosisalainen',
        });
        cy.login({ username: 'DrNo', password: 'tosisalainen' });
        // blog can be viewed but remove button not visible
        cy.viewBlog(blog3);
        cy.contains(blog3.title)
          .parent()
          .find('#remove-btn')
          .should('not.exist');
      });
    });
  });
});
