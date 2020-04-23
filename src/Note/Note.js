import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Note.css'

export default class Note extends React.Component {
    static contextType = ApiContext

    static defaultProps ={
        deleteNote: () => {}
    }

  handleClickDelete(e, suggestionId) {
    e.preventDefault()
    fetch(`${config.API_ENDPOINT}/api/suggestions/${suggestionId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
      })
      .then(this.context.deleteSuggestion(suggestionId))
      .catch(error => {
        console.error(error)
    })
  }

    handleClickDelete = e => {
        e.preventDefault()
        const noteId = this.props.id
        fetch(`${config.API_ENDPOINT}/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status)
                }
            })
            .then(() => {
                if (this.props.changeDashboard) {
                    this.props.changeDashboard()
                }
                this.context.deleteNote(noteId)

            })
            .catch(error => {
                console.error({ error })
            })        
    }

    render() {
        const { datePublished, id, name, modified } = this.props
                return (
                    <div className='Note'>
                <h2 className='Note__title'>
                    <Link to={`/note/${id}`}>
                        {name}
                    </Link>
                </h2>
                <Link
                    to={`/edit/${id}`}
                    className='Note__edit'
                    type='button'
                >
                    <FontAwesomeIcon icon='pencil-alt' />
                    {' '}
                    edit
                </Link>
                <button
                    className='Note__delete'
                    type='button'
                    onClick={this.handleClickDelete}
                >
                    <FontAwesomeIcon icon='trash-alt' />
                    {' '}
                    remove
                </button>
                <div className='Note__dates'>
                    <div className='Note__dates-published'>
                        Published
                        {' '}
                        <span className='Date'>
                            {format(datePublished, 'Do MMM YYYY')}
                        </span>
                    </div>
                    <div className='Note__dates-modified'>
                        Modified
                        {' '}
                        <span className='Date'>
                            {format(modified, 'Do MMM YYYY')}
                        </span>
                    </div>
                </div>
            </div>
         )

    }
}

Note.propTypes = {
  id: PropTypes.number
}
