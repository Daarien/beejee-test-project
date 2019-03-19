import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col, Navbar, Dropdown, Pagination, Table, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckSquare, faEdit, faSortAmountUp, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import { tasks } from './store';
import Account from './components/Account';
import NewTask from './components/NewTask';
import logo from './assets/img/logo.svg';

class App extends Component {
  static propTypes = {
    status: PropTypes.string, // user status
    tasks: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number, // all tasks count
    pages: PropTypes.number, // total pages for pager
    uploading: PropTypes.bool, // while sending new or edited task to server and awaiting response
    added: PropTypes.bool, // notify if new task successfully added
    edited: PropTypes.bool, // notify if task successfully edited
    error: PropTypes.string,
    getTasks: PropTypes.func,
    addTask: PropTypes.func,
    editTasks: PropTypes.func,
    clearWarning: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      sortBy: '', // default by ID asc
      sortDirection: '',
      currentPage: 1,
      addNew: false, // visibility of modal with form for adding new task
      editableTaskID: 0, // ID of task to be edited
      editMode: false,
    };

    this.setTextInputRef = input => this.editedTaskTextInput = input; // ref for text input of task to be edited
    this.setTaskCheckboxRef = checkbox => this.editedTaskCheckbox = checkbox; // and checkbox
  }

  componentDidMount = () => {
    this.props.getTasks();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.sortBy !== this.state.sortBy) {
      this.getData();
    } else
      if (prevState.sortDirection !== this.state.sortDirection) {
        this.getData();
      } else
        if (prevState.currentPage !== this.state.currentPage) {
          this.getData();
        }

    // request new list after adding or editing task
    if (prevProps.uploading && !this.props.uploading) {
      this.props.getTasks();
    }
  }

  static getDerivedStateFromProps(props, state) {
    // change edit mode after successfull editing
    if (props.edited && state.editMode) {
      return { editMode: false };
    }

    // show error modal
    if (state.editMode && !props.edited && props.error) {
      return { error: true };
    }

    return null;
  }

  getData = () => {
    let query = '';
    const { sortBy, sortDirection, currentPage } = this.state;

    if (currentPage > 1) {
      query = `page=${currentPage}`;
    }

    if (sortBy) {
      query = `${query ? '&' : ''}sort_field=${sortBy}&sort_direction=${sortDirection}`;
    }

    this.props.getTasks(query);
  }

  handleSort = (key, event) => {
    this.setState({
      sortBy: event.target.name,
      sortDirection: key,
    });
  }

  handlePagerClick = page => {
    if (page !== this.state.currentPage) {
      this.setState({ currentPage: page });
    }
  }

  handlePagerPrevClick = () => {
    const page = this.state.currentPage;
    if (page > 1) {
      this.setState({ currentPage: page - 1 });
    }
  }

  handlePagerNextClick = () => {
    const page = this.state.currentPage;
    if (page < this.props.pages) {
      this.setState({ currentPage: page + 1 });
    }
  }

  addNewTask = (data) => {
    this.props.addTask(data);
  }

  handleOpenNewTaskModal = () => this.setState({ addNew: true });

  handleCloseNewTaskModal = () => this.setState({ addNew: false });

  handleEditTask = (e) => {
    e.stopPropagation();
    const { id } = e.currentTarget;
    this.setState({
      editMode: true,
      editableTaskID: +id.split('-')[1],
    });
  }

  handleCancelEdition = () => this.setState({ editMode: false, editableTaskID: 0 });

  handleApplyEdition = () => {
    const id = this.state.editableTaskID;
    const text = this.editedTaskTextInput.value;
    const status = this.editedTaskCheckbox.checked ? 10 : 0;
    let formData = new FormData();
    formData.append('text', text);
    formData.append('status', status);

    this.props.editTask(id, formData);
  }

  closeErrorModal = () => {
    this.setState({
      error: false,
      editMode: false
    });
    this.props.clearWarning();
  }

  render() {
    const { tasks, count, pages } = this.props;
    let items = [];
    if (count) {
      for (let page = 1; page <= pages; page++) {
        items.push(<Pagination.Item key={page} onClick={() => this.handlePagerClick(page)} active={this.state.currentPage === page}>{page}</Pagination.Item>);
      }
    }

    return <Fragment>
      <Navbar variant="dark" bg="dark">
        <Container>
          <Navbar.Brand><img src={logo} className='menu-logo' alt='logo' /> Tasks List</Navbar.Brand>
          <Navbar.Collapse className='justify-content-end'>
            <Account />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Row className='mt-4 justify-content-center'>
          <Col xs={6}>
            <Row className='justify-content-between align-items-center'>
              <span className='font-weight-bold'>Sort by:</span>

              {/** by username */}
              <Dropdown onSelect={this.handleSort}>
                <Dropdown.Toggle variant='info' style={{ width: 120 }}>
                  <span className='mr-3'>Name:</span>
                  {this.state.sortBy === 'username'
                    ? this.state.sortDirection === 'asc'
                      ? <FontAwesomeIcon icon={faSortAmountUp} />
                      : <FontAwesomeIcon icon={faSortAmountDown} />
                    : ''
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey='asc' name='username'>Asc</Dropdown.Item>
                  <Dropdown.Item eventKey='desc' name='username'>Desc</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/** by email */}
              <Dropdown onSelect={this.handleSort}>
                <Dropdown.Toggle variant='info' style={{ width: 120 }}>
                  <span className='mr-3'>Email:</span>
                  {this.state.sortBy === 'email'
                    ? this.state.sortDirection === 'asc'
                      ? <FontAwesomeIcon icon={faSortAmountUp} />
                      : <FontAwesomeIcon icon={faSortAmountDown} />
                    : ''
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey='asc' name='email'>Asc</Dropdown.Item>
                  <Dropdown.Item eventKey='desc' name='email'>Desc</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/** by status */}
              <Dropdown onSelect={this.handleSort}>
                <Dropdown.Toggle variant='info' style={{ width: 120 }}>
                  <span className='mr-3'>Status:</span>
                  {this.state.sortBy === 'status'
                    ? this.state.sortDirection === 'asc'
                      ? <FontAwesomeIcon icon={faSortAmountUp} />
                      : <FontAwesomeIcon icon={faSortAmountDown} />
                    : ''
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey='asc' name='status'>Asc</Dropdown.Item>
                  <Dropdown.Item eventKey='desc' name='status'>Desc</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

            </Row>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col xs md={{ span: 10, offset: 1 }}>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>UserName</th>
                  <th>Email</th>
                  <th>Text</th>
                  <th>Status</th>
                  {this.props.status === 'admin' &&
                    <Fragment>
                      <th></th>
                      <th></th>
                    </Fragment>
                  }
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  return <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.username}</td>
                    <td>{task.email}</td>
                    <td>
                      {this.state.editMode && +task.id === this.state.editableTaskID
                        ? <input type='text' defaultValue={task.text} ref={this.setTextInputRef} />
                        : <span>{task.text}</span>
                      }
                    </td>
                    <td>
                      {this.state.editMode && +task.id === this.state.editableTaskID
                        ? <input type='checkbox' defaultChecked={task.status ? true : false} ref={this.setTaskCheckboxRef} />
                        : task.status ? <FontAwesomeIcon icon={faCheckSquare} /> : ''
                      }
                    </td>
                    {this.props.status === 'admin' &&
                      <Fragment>
                        <td className='control-buttons'>
                          {this.state.editMode && +task.id === this.state.editableTaskID
                            ? <Button variant='info' size='sm' onClick={this.handleApplyEdition}>Save</Button>
                            : <Button variant='info' size='sm' id={`task-${task.id}`} onClick={this.handleEditTask}>
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                          }
                        </td>
                        <td className='cancel-button-wrapper'>
                          {this.state.editMode && +task.id === this.state.editableTaskID
                            ? <Button variant='info' size='sm' onClick={this.handleCancelEdition}>X</Button>
                            : ''
                          }
                        </td>
                      </Fragment>
                    }
                  </tr>
                })}
              </tbody>
            </Table>

            <hr />

            <div className='d-flex justify-content-between align-items-center'>
              {/* modal for new task */}
              <NewTask
                isOpen={this.state.addNew}
                closeModal={this.handleCloseNewTaskModal}
                onSubmit={this.addNewTask}
                awaiting={this.props.uploading}
                added={this.props.added}
              />
              <Button variant='info' onClick={this.handleOpenNewTaskModal}>
                <FontAwesomeIcon icon={faPlus} />
                <span className='ml-2'>task</span>
              </Button>

              <Pagination className='mt-2'>
                <Pagination.Prev onClick={this.handlePagerPrevClick} />
                {count ? items : null}
                <Pagination.Next onClick={this.handlePagerNextClick} />
              </Pagination>

            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={this.state.error} onHide={this.closeErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.error}</Modal.Body>
        <Modal.Footer>Watch console for details</Modal.Footer>
      </Modal>

    </Fragment>;
  }
}

export default connect(
  ({ account, tasks }) => ({
    status: account.status,
    tasks: tasks.tasks,
    count: tasks.count,
    pages: tasks.pages,
    uploading: tasks.uploading,
    added: tasks.added,
    edited: tasks.edited,
    error: tasks.error,
  }),
  tasks.dispatcher
)(App);