import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './page-a.scss'

type MessageData = {
    from: string
    data: string
}

const PageA = ({ history }: RouteComponentProps) => {
    console.log('pageA 执行了')
    const bc = useRef<BroadcastChannel>(null)
    const [message, setMessage] = useState('0')
    const dataList = useRef<MessageData[]>([])
    const update = useState(null)[1]
    const messagePost = () => {
        console.log('post message')
        bc.current.postMessage({ message, from: 'PageA' })
    }
    const closeChannel = () => {
        console.log('close channel')
        bc.current.close()
    }

    const openChannel = () => {
        console.log('open channel')
        if (bc.current) {
            bc.current.close()
        }
        bc.current = new BroadcastChannel('testPostMessage')
        console.log('hi')
        bc.current.onmessage = function (e) {
            console.log('hi')
            console.log(e)
            const { message: data, from } = e.data
            console.log(dataList.current)
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
            <div>PageA</div>
            <Button type="primary" onClick={() => history.push('/page-b')}>
                Go To B
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

export default withRouter(PageA)
