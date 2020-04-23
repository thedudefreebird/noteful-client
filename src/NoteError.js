import React from 'react';

class NoteError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {      
      return (
        <div className='Note'>
        <h2 className='Note__title'>
            Could note display this note.
        </h2>
        <button
          className='Note__delete'
          type='button'
          onClick={this.handleClickDelete}
        >
          {' '}
          remove
        </button>
      </div>
      );
    }
    return this.props.children;
  }  
}

export default NoteError;