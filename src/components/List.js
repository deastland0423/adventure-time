import React from 'react';

const List = (props) => {
  const { repos } = props;
  if (!repos || repos.length === 0) {
        return <p>No repos, sorry</p>;
  }

  return (
    <ul>
      <h2 className='list-head'>User Accounts in the Server</h2>
      {repos.map((repo) => {
        return (
          <li key={repo.id} className='list'>
            <span className='repo-text'>{repo.email_address} </span>
            <span className='repo-description'>{repo.password}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default List;
