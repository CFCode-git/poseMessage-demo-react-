import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './page-b.scss'

type MessageData = {
    data: string
    from: string
}

const PageB = ({ history }: RouteComponentProps) => {
    const bc = useRef<BroadcastChannel>(null)
    const [message, setMessage] = useState('0')
    const dataList = useRef<MessageData[]>([])
    const update = useState(null)[1]
    const messagePost = () => {
        console.log('post message')
        bc.current.postMessage({ message, from: 'PageB' })
    }
    const closeChannel = () => {
        console.log('close channel')
        bc.current.close()
    }

    const openChannel = () => {
        console.log('open channel')
        if (bc.current) bc.current.close()
        bc.current = new BroadcastChannel('testPostMessage')
        bc.current.onmessage = function (e) {
            console.log(e)
            const { message: data, from } = e.data
            dataList.current.push({ data, from })
            update(Math.random())
        }
    }

    useEffect(() => {
        console.log('执行了')
        openChannel()
    }, [])

    return (
        <div>
            <div>PageB</div>
            <Button type="primary" onClick={() => history.push('/')}>
                Go To A
            </Button>
            <div className={styles.postMessageTest}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                />
                <Button type="primary" onClick={messagePost}>
                    postMessage
                </Button>
                <Button type="primary" onClick={closeChannel}>
                    closeChannel
                </Button>
                <Button type="primary" onClick={openChannel}>
                    openChannel
                </Button>
                {message}
            </div>
            <div className={styles.postMessageTest}>{JSON.stringify(dataList.current)}</div>
        </div>
    )
}

export default withRouter(PageB)
