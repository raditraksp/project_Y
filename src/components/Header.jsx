import React, {useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {Link} from 'react-router-dom'
import axios from '../config/api'
import {loginAction} from '../config/redux/actions'
import {
   Button,
   Collapse,
   DropdownToggle,
   DropdownMenu,
   DropdownItem,
   Navbar,
   NavbarToggler, 
   Nav,
   NavLink,
   NavItem,
   NavbarText,
   NavbarBrand,
   UncontrolledDropdown,
   Modal,
   ModalHeader, 
   ModalBody, 
   ModalFooter 
   } from 'reactstrap';

export default function Header() {

    const [isOpen, setIsOpen] = useState(false)
    const [modal, setModal] = useState(false)
    const username = useSelector(state =>  state.auth.username)
    const dispatch = useDispatch()
        

    const isToggle = () => setIsOpen((prevState) => !prevState)
    const funModal = () => setModal((prevState) => !prevState)

    const usernameRef = useRef()
    const passwordRef = useRef()

    const onButtonClick = () => {
        const username = usernameRef.current.value
        const password = passwordRef.current.value

        axios.post('/user/login', {username, password})
        .then(({data : {token, user : {id, username}}}) => {
           
           // simpan ke redux
           dispatch(loginAction({id, username, token}))

        })
        .catch(err => alert(err.response.data.message))
        setModal((prevState) => !prevState)
  }

    const renderNav = () => {
        // Jika tidak login
        
        return !username ? (
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink tag={Link} to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                    <button onClick={funModal} className="btn btn-outline-secondary mb-2 px-4 btn-block">Login</button>
                </NavItem>
            </Nav>
        ) :(
            <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        Hello, {username}
                    </DropdownToggle>
                    <DropdownMenu right>

                        <NavLink tag={Link} to="/manageproduct" >
                            <DropdownItem> Manage Product</DropdownItem>
                        </NavLink>

                        <NavLink tag={Link} to="/profile">
                            <DropdownItem>Profile</DropdownItem>
                        </NavLink>

                        <NavLink tag={Link} to="/editprofile">
                            <DropdownItem>Edit Profile</DropdownItem>
                        </NavLink>

                        <DropdownItem divider />

                        <DropdownItem onClick={() => dispatch({type: 'LOGOUT_SUCCESS'})}>
                            Logout
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        )
    }

    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand tag={Link} to="/">reactstrap</NavbarBrand>
                <NavbarToggler onClick={isToggle} />
                <Collapse isOpen={isOpen} navbar>
                    
                    {renderNav()}

                </Collapse>
            </Navbar>

            <Modal isOpen={modal} toggle={funModal}>
                        
                <ModalBody>
                <div className="border-bottom border-secondary card-title text-center ">
                                    <h1>Login to Jasaja</h1>
                                </div>
    
                                <form className='form-group'>
                                    <div className="card-title ">
                                    </div>
                                    <input ref={usernameRef} type='text' placeholder="Username" className='form-control' required/>
    
                                    <div className="card-title ">
                                    </div>
                                    <input ref={passwordRef} type='password' placeholder="Password" className='form-control'/>
                                </form>
    
                                <button className="btn btn-success btn-block" onClick={onButtonClick} >Login</button>
                </ModalBody>
            </Modal>
        </div>
    )
}
