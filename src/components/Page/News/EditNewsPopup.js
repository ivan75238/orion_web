import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import CustomDatePicker from "components/Elements/DatePicker";
import {connect} from "react-redux";
import _get from "lodash/get";
import {toast} from "react-toastify";
import {API} from "components/API";
import Input from "components/Elements/Input";
import CustomTextArea from "components/Elements/CustomTextArea";


@connect(state => ({
    user: _get(state.app, "user"),
}))
class EditNewsPopup extends PureComponent {
    defaultState = {
        id: null,
        date: new Date(),
        title: "",
        messages: "",
        image_url: "",
        file: null
    };

    constructor(props) {
        super(props);
        this.state = typeof props.item === "string" ? this.defaultState : props.item;
        this.fileRef = React.createRef();
    }

    create = async() => {
        const {onClose, onUpdate, item, user} = this.props;
        const {date, title, image_url, messages, file, id, id_user} = this.state;

        if (!date) {
            toast.warn("Выберите дату публикации");
            return;
        }
        if (!title) {
            toast.warn("Введите заголовок");
            return;
        }
        if (!messages) {
            toast.warn("Введите текст новости");
            return;
        }

        if (typeof item !== "string"){
            let uploadFileNamePath = this.props.item.image_url;
            if (this.props.item.image_url !== image_url) {
                uploadFileNamePath = await API.file.uploadNews(file);
            }

            await API.news.edit({
                date,
                title,
                messages,
                id,
                id_user,
                image_url: uploadFileNamePath
            });
        }
        else {
            if (!file) {
                toast.warn("Выберите изображение");
                return;
            }
            let uploadFileNamePath = await API.file.uploadNews(file);
            await API.news.create({
                date,
                title,
                messages,
                id_user: user.id,
                image_url: uploadFileNamePath
            });
        }
        toast.success("Новость опубликована");
        onClose();
        onUpdate();
    };

    selectFileHandler = (e) => {
        let file = _get(Array.from(e.target.files), "0");
        if (!file)
            return;

        this.setState({
            image_url: _get(file, "name", ""),
            file
        });
    };

    render() {
        const {onClose, item} = this.props;
        const {date, title, image_url, messages} = this.state;

        return (
            <Popup onClose={onClose}
                   title={typeof item === "string" ? "Добавить новость" : "Редактировать новость"}
                   width={"400px"}
                   buttons={
                       <Button title={"Добавить"}
                               height="40px"
                               onClick={this.create}/>
                   }>
                <Input width="100%"
                       value={title}
                       onChange={title => this.setState({title})}
                       title="Заголовок"
                       height="40px"
                       padding="8px 0"/>
                <CustomDatePicker selected={new Date(date)}
                                  onChange={date => this.setState({date})}
                                  height="40px"
                                  width="100%"
                                  title="Дата публикации"
                                  margin={"16px 0 0 0"}
                                  dateFormat="dd.MM.yyyy"/>
                <CustomTextArea width={"100%"}
                                value={messages}
                                maxRows={16}
                                minRows={1}
                                margin={"16px 0 16px 0"}
                                onChange={messages => this.setState({messages})}
                                title={"Текст новости"}/>
                <Input width="100%"
                       value={image_url}
                       title="Имя файла"
                       height="40px"
                       margin={"0 0 16px 0"}
                       padding="8px 0"/>
                <input type="file" style={{'display': 'none'}}
                       ref={this.fileRef}
                       onChange={this.selectFileHandler}/>
                <Button title={"Выбрать изображение"}
                        height="40px"
                        onClick={() => this.fileRef.current.click()}/>
            </Popup>
        )
    }
}

EditNewsPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default EditNewsPopup;
