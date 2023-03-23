import theme from "../../../configs/theme";

interface IRailItemProps {
  label: string;
  thumbnail: string;
}

const RailItem: React.FunctionComponent<IRailItemProps> = (props:IRailItemProps) => {
  const {label,thumbnail} = props;
  return (
    <div>
       <div style={{backgroundColor:'#14233E', height:432, width:288}}>
        <img 
        src={thumbnail || 'https://pmd205470tn-a.akamaihd.net/D2C_-_Content/191/249/oyPcsfGWL5Se6RGW1JCVgpHlASH_288x432_13635141800.jpg'} 
        height={432} width={288} alt={'img'} style={{objectFit:'cover'}} />
      </div>
      <div style={{color:theme.colors.white}}>{label}</div>
    </div>
  );
};

export default RailItem;
