import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const EditProduct = () => {
    const [title, setTitle] = useState("")
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState("")
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getProductById()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getProductById = async () => {
        const response = await axios.get(`http://localhost:5000/products/${id}`)
        setTitle(response.data.name)
        setPreview(response.data.url)
    };

    const loadImage = (e) => {
        const image = e.target.files[0]
        setFile(image)
        setPreview(URL.createObjectURL(image))
    };

    const updateProduct = async (e) => {
        e.preventDefault()
        const formData = new FormData()

        formData.append("title", title)
        if (file) {
            formData.append("file", file)
        }

        try {
            await axios.patch(`http://localhost:5000/products/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="columns is-centered mt-5">
            <div className="column is-half">
                <form onSubmit={updateProduct}>
                    <div className="field">
                        <label className="label">Product Name</label>
                        <div className="control">
                            <input className="input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product Name" />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Image</label>
                        <div className="control">
                            <div className="file">
                                <label className="file-label">
                                    <input className="file-input" type="file" onChange={loadImage} />
                                    <span className="file-cta">
                                        <span className="file-label">Choose a file...</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {preview ? (
                        <figure className="image is-128x128">
                            <img src={preview} alt="Preview Image" />
                        </figure>
                    ) : (
                        ""
                    )}
                    <div className="field">
                        <div className="control">
                            <button className="button is-success" type="submit">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
