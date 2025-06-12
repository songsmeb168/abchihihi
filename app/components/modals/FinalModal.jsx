import { Button, Form, Modal } from 'antd'
import React from 'react'

const FinalModal = ({ openFinalModal, onCancelFinalModal }) => {
    return (
        <>
            <Modal
                open={openFinalModal}
                centered
                onCancel={onCancelFinalModal}
                maskClosable={false}
                footer={null}
                width={{
                    xs: '90%',
                    sm: '70%',
                    md: '60%',
                    lg: '45%',
                    xl: '35%',
                    xxl: '29%',
                }}
            >
                <div className='desc'>
                    <h4>Request has been sent</h4>
                    <img src="/background-final.png" width="100%" style={{ "borderRadius": "10px", "margin": "15px auto 15px auto" }} alt="" />
                    <p>Your request has been added to the processing queue. We will process your request within 24 hours. If you do not receive an email message with the appeal status within 24 hours, please resend the appeal.</p>
                </div>

                <Form>
                    <Form.Item>
                        <Button className='button-send' onClick={() => { window.location.href = 'https://www.facebook.com' }}>
                            Return to Facebook
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default FinalModal