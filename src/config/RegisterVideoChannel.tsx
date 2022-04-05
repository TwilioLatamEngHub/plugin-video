import React from 'react';
import * as Flex from '@twilio/flex-ui';
import IncomingVideoComponent from '../IncommingVideo';
import AppStateProvider from '../states/AppStateProvider';

const RegisterVideoChannel = (flex: typeof Flex, manager: Flex.Manager ) => {
    const videoChannel = flex.DefaultTaskChannels.createDefaultTaskChannel('video', (task) => task.taskChannelUniqueName === 'video');
    videoChannel.icons = {
        active: 'Video',
        list: {
            Assigned:  'Video',
            Canceled:  'Video',
            Completed: 'Video',
            Pending:   'Video',
            Reserved:  'Video',
            Wrapping:  'Video'
        },
        main: 'Video'
      };
    videoChannel.addedComponents = [
        {
            target: "TaskCanvasTabs",
            options: {
                sortOrder: 1,
                align: 'start'
            },
            component: <AppStateProvider key="IncomingVideoComponent">
                <IncomingVideoComponent manager={manager}  />
            </AppStateProvider>
            
        }
    ];

    flex.TaskChannels.register(videoChannel);
}

export default RegisterVideoChannel