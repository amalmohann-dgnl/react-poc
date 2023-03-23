import * as React from 'react';
import Rail from '../../components/organism/Rail/Rail';
import { endp } from '../../configs/endpoint-url';

interface IHomeProps {
}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <div style={{ padding:20, }}>
      {
       endp.map((endpoint, index) =>  <Rail railIndex={index} key={endpoint}/>)
      }
    </div>
  );
};

export default Home;
