import moment from "moment";
// import "moment/dist/locale/fr";

interface DateLangProps {
  date: string | Date;
  format?: string;
  lang?: string;
}

const dateLang = ({ date, format = "DD MM YYYY", lang = "fr" }: DateLangProps): string => {
  return moment(date).locale(lang).format(format);
};

const format_date = (date: string | Date, format = "DD MM YYYY", lang = "fr"): string =>
  dateLang({ date, format, lang });

export default format_date;
