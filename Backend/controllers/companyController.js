const CompanyKeyword = require("../models/CompanyKeyword");

exports.getCompanyKeywords = async (req, res) => {
  try {
    const { companyName } = req.params;

    const keywords = await CompanyKeyword.find({
      company_name: new RegExp(`^${companyName}$`, "i"), // 대소문자 무시
    });
    console.log(keywords);

    if (!keywords || keywords.length === 0) {
      return res
        .status(404)
        .json({ message: "해당 회사의 키워드를 찾을 수 없습니다." });
    }

    // const keywordData = {};
    const keywordArray = keywords.map((item) => ({
      category: item.category,
      score: item.score,
      count: item.count,
      comments: item.comments,
    }));

    res.status(200).json({ keywordArray });
  } catch (error) {
    console.error("기업 키워드 조회 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
