import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  test('Updates parent state and calls onSubmit', () => {
    const createBlog = jest.fn();

    const component = render(<BlogForm createBlog={createBlog} />);

    const form = component.container.querySelector('form');
    const title = component.container.querySelector('#title');
    const author = component.container.querySelector('#author');
    const url = component.container.querySelector('#url');

    fireEvent.change(title, {
      target: { value: 'Simple Jest Test' },
    });
    fireEvent.change(author, {
      target: { value: 'Jest Tester' },
    });
    fireEvent.change(url, {
      target: { value: 'http://www.jesting.com' },
    });

    fireEvent.submit(form);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toStrictEqual({
      title: 'Simple Jest Test',
      author: 'Jest Tester',
      url: 'http://www.jesting.com',
    });
  });
});
