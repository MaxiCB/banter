import React from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';

const Avatar = ({ username, ...rest }) => (
  <Box
    size="42px"
    display="block"
    width="100%"
    background={`#f8a5c2 url(${`/api/avatar/${username}`}) center center no-repeat`}
    borderRadius="100%"
    overflow="hidden"
    style={{
      backgroundSize: 'cover',
    }}
    {...rest}
  />
);

const Username = ({ ...rest }) => <Type mt={0} fontWeight={600} {...rest} />;

const TimeAgo = ({ ...rest }) => <Type fontSize={0} {...rest} />;

const Meta = ({ username, timeago, ...rest }) => (
  <Flex pb={1} alignItems="flex-end" justifyContent="space-between" {...rest}>
    <Username>{username}</Username>
    <TimeAgo>{timeago}</TimeAgo>
  </Flex>
);

const MessageContent = ({ content, ...rest }) => (
  <Type {...rest}>
    <Linkify
      options={{
        format: (value) => value,
        formatHref: (href, type) => {
          if (type === 'mention') {
            return `/users${href}`;
          }
          return href;
        },
        defaultProtocol: 'https',
      }}
    >
      {content}
    </Linkify>
  </Type>
);

const Details = ({ ...rest }) => <Box ml={3} width={7 / 8} {...rest} />;

const Container = ({ ...rest }) => (
  <Flex px={3} py={3} alignItems="center" borderTop="1px solid rgb(230, 236, 240)" {...rest} />
);

const Message = ({ message }) => (
  <Container>
    <Avatar username={message.attrs.createdBy} />
    <Details>
      <Meta username={message.attrs.createdBy} timeago={message.ago()} />
      <MessageContent content={message.attrs.content} />
    </Details>
  </Container>
);

export default Message;
