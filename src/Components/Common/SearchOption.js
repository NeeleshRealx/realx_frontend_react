import React, { useEffect, useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import { Input,Button,Modal,ModalBody } from 'reactstrap';

import axios from 'axios';

const ClickOutsideWrapper = ({ children, onClickOutside }) => {
    const wrapperRef = useRef(null);

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            onClickOutside();
        }
    };

    React.useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return <div ref={wrapperRef}>{children}</div>;
};
const SearchOption = () => {
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('customer');
    const [searchlist, setSearchList] = useState("");
    const searchRef = useRef(null);
    const toggleDropdown = () => {
        setSearchList("")
        setIsOpen(!isOpen);
    };

    const handleItemClick = (value) => {
        setSelectedItem(value);
        setIsOpen(false); // close the dropdown after selection
    };

    const SearchBar = (e) =>{
        if (isOpen===true){
            setIsOpen(false)
        }
        var postData = {
            "type": selectedItem,
            "query": e.target.value
        }
        axios.post("api/ajax-main-search", postData).then((res)=>{
            if(typeof res != "object" && res != ""){
                setSearchList(res);
            }else{
                setSearchList("");
            }
        })
    }
    const handleSearchListClose = () => {
        setSearchList("");
    };
    return (
        <React.Fragment>
        <ClickOutsideWrapper onClickOutside={handleSearchListClose}>
            <form className="app-search d-none d-md-block">
                <div >
                <div className="hstack gap-0">
                    <div className="">
                        <div className="btn btn-light input-group-text"
                            style={{
                                borderTopLeftRadius: '30px',
                                borderBottomLeftRadius: '30px',
                                backgroundColor: '#fff'
                            }}>
                            {selectedItem === 'customer' ? (
                                <i className="bx bx-user"></i>
                            ) : selectedItem === 'job' ? (
                                <i className="bx bx-car"></i>
                            ) : selectedItem === 'tags' ? (
                                <i className="bx bx-hash"></i>
                            ) : null}
                        </div>
                    </div>
                    <Input type="hidden" id="w_top_search_type" value="customer" />
                    <Input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        placeholder="Search"
                        onChange={(e) => SearchBar(e)}
                        ref={searchRef}
                    />
                    <div className="input-group-prepend">
                        <Button
                            type="button"
                            className="btn btn-light btn-icon dropdown-toggle"
                            style={{
                                borderTopRightRadius: "30px",
                                borderBottomRightRadius: "30px",
                                backgroundColor: "#fff"
                            }}
                            aria-expanded={isOpen}
                            onClick={toggleDropdown}
                        ></Button>
                        {isOpen && (
                            <div
                                className="dropdown-menu show"
                                style={{
                                    position: "absolute",
                                    willChange: "transform",
                                    top: "15px",
                                    left: "0px",
                                    transform: "translate3d(155px, 40px, 0px)"
                                }}
                            >
                                <a href="#" className="dropdown-item top_search_type" onClick={() => handleItemClick('customer')} data-value="customer" data-view="w">
                                    Customer
                                </a>
                                <a href="#" className="dropdown-item top_search_type" onClick={() => handleItemClick('job')} data-value="other" data-view="w">
                                    Job/Opportunity Number
                                </a>
                                <a href="#" className="dropdown-item top_search_type" onClick={() => handleItemClick('tags')} data-value="tags" data-view="w">
                                    Tags
                                </a>
                            </div>
                        )}
                    </div>
                    {searchlist && <div className={`${selectedItem!=="customer"?"search_list_spacing top_search_list card":"top_search_list card"}`}  dangerouslySetInnerHTML={{__html: searchlist} }>
                    </div>}
                </div>
                </div>
            </form>
        </ClickOutsideWrapper>
        </React.Fragment>
    );
};

export default SearchOption;