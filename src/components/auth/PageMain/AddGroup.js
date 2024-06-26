import React, { useRef, useState, useEffect } from 'react'
import { BE_URL } from '../../../utils/Url_request';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import DetailClass from '../DetailClass';

const AddGroup = () => {
    const { classId } = useParams();
    const createClassRef = useRef();
    const navigate = useNavigate();
    const numberOfGroup = parseInt(localStorage.getItem('numberOfGroup'), 10);

    const [groupData, setGroupData] = useState({
        classId: classId,
        groupName: '',
        leaderId: '',
    });

    const [currentGroupCount, setCurrentGroupCount] = useState(0);

    useEffect(() => {
        const fetchGroupCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${BE_URL}/api-gv/classId/group-list/${classId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentGroupCount(data.length);
                } else {
                    console.error('Failed to fetch group list');
                }
            } catch (error) {
                console.error('Error fetching group list:', error);
            }
        };

        fetchGroupCount();
    }, [classId]);

    const handleChange = (e) => {
        setGroupData({ ...groupData, [e.target.name]: e.target.value });
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();

        if (currentGroupCount >= numberOfGroup) {
            alert('Số lượng nhóm đã đạt giới hạn');
            return;
        }

        if (!groupData.groupName || !groupData.leaderId) {
            window.alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${BE_URL}/api/class/create-a-group`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ ...groupData })
            });

            if (response.ok) {
                alert('Add group successfully!');
                navigate(`/group/${classId}`);
                setCurrentGroupCount(currentGroupCount + 1);
            } else {
                window.alert('Add group failed!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteGroup = async (id) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa nhóm này không?");
        if (!confirmed) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const url = `${BE_URL}/api/group/${id}`;
            const responseDelete = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (responseDelete.ok) {
                alert("Xóa nhóm thành công!");
                setCurrentGroupCount(currentGroupCount - 1);
            } else {
                console.error('Failed to delete group');
                alert("Đã xảy ra lỗi khi xóa nhóm!");
            }
        } catch (error) {
            console.error('Error deleting group:', error);
            alert("Đã xảy ra lỗi khi xóa nhóm!");
        }
    };

    return (
        <div>
            <Navbar />
            <DetailClass />
            <div ref={createClassRef} className='container-create-project'>
                <form className='addGroup'>
                    <input
                        type='number'
                        placeholder='Mã leader'
                        className='input'
                        name='leaderId'
                        value={groupData.leaderId}
                        onChange={handleChange}
                    />
                    <input
                        type='text'
                        placeholder='Tên nhóm'
                        className='input'
                        name='groupName'
                        value={groupData.groupName}
                        onChange={handleChange}
                    />
                    <button className='button-create' onClick={handleCreateGroup}>Create</button>
                </form>
            </div>
        </div>
    );
}

export default AddGroup;
