import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;
  let mockHandler;

  beforeEach(() => {
    const blog = {
      author: 'Jest Tester',
      id: '123',
      likes: 3,
      title: 'Simple Jest Test',
      url: 'http://www.jesting.com',
      user: {
        id: '123',
        name: 'James Bond',
        username: '007',
      },
    };

    mockHandler = jest.fn();

    component = render(<Blog blog={blog} updateBlog={mockHandler} />);

  });

  test('renders only title, author and view on mount', () => {
    expect(component.container).toHaveTextContent(
      'Simple Jest Test Jest Tester view'
    );
    expect(component.container).not.toHaveTextContent('http://www.jesting.com');
    expect(component.container).not.toHaveTextContent('Likes 3');
    expect(component.container).not.toHaveTextContent('James Bond');
  });

  test('renders full blog info after clicking view', () => {
    const button = component.getByText('view');
    fireEvent.click(button);

    expect(component.container).toHaveTextContent(
      'Simple Jest Test Jest Tester hide'
    );
    expect(component.container).toHaveTextContent('http://www.jesting.com');
    expect(component.container).toHaveTextContent('Likes 3');
    expect(component.container).toHaveTextContent('James Bond');
  });

  test('like-button click are counted correctly', () => {
    const viewBtn = component.getByText('view');
    fireEvent.click(viewBtn);

    const likeBtn = component.getByText('Like');
    fireEvent.click(likeBtn);
    fireEvent.click(likeBtn);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
