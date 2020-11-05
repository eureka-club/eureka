import { NextPage } from 'next';

import SimpleLayout from '../components/layouts/SimpleLayout';

const IndexPage: NextPage = () => {
  return (
    <SimpleLayout title="Welcome">
      <h2>Lorem ipsum</h2>
      <p>
        dolor sit amet, consectetur adipiscing elit. Integer posuere lacinia luctus. Aliquam erat volutpat. Integer a ex
        maximus, feugiat mi et, mollis dui. Morbi eu lorem urna. Donec dictum ac tellus sed ullamcorper. Duis finibus
        auctor maximus. Suspendisse ut massa ut elit ullamcorper efficitur. In pretium sit amet eros sed malesuada. Cras
        porttitor lectus nec ex blandit, et porta ipsum maximus. Orci varius natoque penatibus et magnis dis parturient
        montes, nascetur ridiculus mus. Phasellus vitae porttitor dolor.
      </p>

      <h3>Sed porta urna felis</h3>
      <p>
        eu lacinia magna mollis a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dapibus ligula ut
        orci tincidunt euismod. Proin urna magna, sodales ut faucibus quis, porta sed urna. Nam vitae mollis nisl. Fusce
        id nisl sed arcu sodales semper sit amet et odio. Class aptent taciti sociosqu ad litora torquent per conubia
        nostra, per inceptos himenaeos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
        turpis egestas. Phasellus ultricies dapibus nisl vel ornare. Nulla in ligula a turpis commodo condimentum ut a
        urna. Aenean tempus ligula non urna facilisis laoreet.
      </p>
    </SimpleLayout>
  );
};

export default IndexPage;
