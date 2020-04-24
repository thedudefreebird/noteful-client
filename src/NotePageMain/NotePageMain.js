import React from 'react';
import Note from '../Note/Note';
import ApiContext from '../ApiContext';
import PropTypes from 'prop-types';
import NoteError from '../NoteError';
import config from '../config';
import { Redirect } from 'react-router-dom'
import './NotePageMain.css';

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  }
  static contextType = ApiContext

  state = {
    note: {},
    toDashboard: false
  }

  componentDidMount() {
    const { noteId } = this.props.match.params
    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'GET'
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))

        return res.json()
      })
      .then(note => {
        this.setState({
          note
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  changeDashboard = () => {
    this.setState({toDashboard: true})
  }
  

  render() {
    const { id, name, date_published, modified, content } = this.state.note
    if (this.state.toDashboard === true) {
      return (
          <Redirect to='/' />
      )
  } else {
    return (
      <section className='NotePageMain'>
        <NoteError>
          <Note
            id={id}
            name={name}
            datePublished={date_published}
            modified={modified}
            changeDashboard={this.changeDashboard}
          />
          <div className='NotePageMain__content'>
            {content}
          </div>
        </NoteError>
      </section>
    )
  }
}
}

NotePageMain.propTypes = {
  match: PropTypes.object
};

