import React, { Component } from  'react'
import ApiContext from '../ApiContext'

export default class EditNoteForm extends Component {
    constructor(props) {
        super(props)
        this.onNameChange = this.onNameChange.bind(this)
        this.onContentChange = this.onContentChange.bind(this)
        this.handleClickSubmit = this.handleClickSubmit.bind(this)
    }

    static contextType = ApiContext

    static defaultProps = {
        updateNote: () => {}
    }

    onNameChange = e => {
        this.props.onNameChange(e.target.value)
    }

    onContentChange = e => {
        this.props.onContentChange(e.target.value)
    }

    handleClickSubmit = e => {
        e.preventDefault()
        this.props.onSubmit()
    }

    render() {
        const { name, content } = this.props.note
        return (
            <section className='EditNoteForm'>
                <form onSubmit={this.handleSubmit}>
                    <input
                        id='name'
                        type='text'
                        name='name'
                        placeholder={name}
                        required
                        value={name}
                        onChange={this.onNameChange} 
                    />
                    <input
                        id='content'
                        type='text'
                        name='content'
                        placeholder={content}
                        value={content}
                        onChange={this.onContentChange}
                    />
                    <button
                        onClick={this.handleClickSubmit}
                    >
                    Submit
                    </button>
                </form>
            </section>
        )
    }
}