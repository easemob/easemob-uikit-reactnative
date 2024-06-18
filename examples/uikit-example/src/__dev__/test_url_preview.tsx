import * as React from 'react';
import { Text, View } from 'react-native';
import { Container, useUrlPreview } from 'react-native-chat-uikit';

export function Test1() {
  const { fetchUrlPreview } = useUrlPreview();
  const [url, setUrl] = React.useState('' as string);
  const [description, setDescription] = React.useState('' as string);
  const [title, setTitle] = React.useState('' as string);
  const [imageUrl, setImageUrl] = React.useState('' as string);
  React.useEffect(() => {
    fetchUrlPreview('https://www.163.com/')
      .then((res) => {
        console.log('test:zuoyu:res', res);
        if (res) {
          setUrl(res.url);
          if (res.title) setTitle(res.title);
          if (res.description) setDescription(res.description);
          if (res.imageUrl) setImageUrl(res.imageUrl);
        }
      })
      .catch((e) => {
        console.log('test:zuoyu:error', e);
      });
  }, [fetchUrlPreview]);
  return (
    <View style={{ flex: 1, top: 100 }}>
      <Text>{`url: ${url}`}</Text>
      <Text>{`title: ${title}`}</Text>
      <Text>{`desc: ${description}`}</Text>
      <Text>{`image: ${imageUrl}`}</Text>
    </View>
  );
}

export default function TestClosure() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <Test1 />
    </Container>
  );
}
