const puppeteer = require("puppeteer");
const path = require("path");
const Resume = require("../models/Resume");
const Education = require("../models/Education");
const Career = require("../models/Career");
const Certificate = require("../models/Certificate");
const Skills = require("../models/Skills");
const OtherInfo = require("../models/OtherInfo");
const CompanyTest = require("../models/CompanyTest");
const { v4: uuidv4 } = require("uuid");

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.uploadResume = async (req, res) => {
  // 이력서 업로드 & db저장
  try {
    const {
      name,
      birth_date,
      gender,
      address,
      phone,
      current_salary,
      desired_salary,
      education, // 여기부터 otherinfo까지 stringified 배열로 보내주세요
      career,
      certificates,
      skills,
      otherinfo,
      companyTest, // 테스트 결과
    } = req.body;

    const resumeId = uuidv4();
    const filename = `Resume_${resumeId}.pdf`;
    const pdfPath = path.join(__dirname, "../pdf/resumes", filename);

    // htmlContent를 pdf로 변환
    /*
    if (htmlContent) {
      const browser = await puppeteer.launch({ headless: "new" }); // Puppeteer 실행
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
      });
      await browser.close();
    }*/

    // DB 저장
    const resume = new Resume({
      resume_id: resumeId,
      name,
      //filePath: `../pdf/resumes/${filename}`,
      filePath: `${pdfPath}`,
      keyword: [],
      birth_date,
      gender,
      address,
      phone,
      current_salary,
      desired_salary,
      createdAt: new Date(),
    });
    await resume.save();

    // 여기부터 stringified 배열로 보내주세요

    // 교육사항 저장
    if (education) {
      const eduArray = JSON.parse(education);
      for (const edu of eduArray) {
        await Education.create({
          resume_id: resume.resume_id,
          //start_year: edu.start_year,
          //end_year: edu.end_year,
          school_name: edu.school_name,
          degree: edu.degree,
          major: edu.major,
          graduation_status: edu.graduation_status,
        });
      }
    }

    // 경력 저장
    if (career) {
      const careerArray = JSON.parse(career);
      for (const job of careerArray) {
        await Career.create({
          resume_id: resume.resume_id,
          company_name: job.company_name,
          position: job.position,
          description: job.description,
          start_year: job.start_year,
          //end_year: job.end_year,
          isCurrent: job.isCurrent,
          end_year: job.isCurrent ? "" : job.end_year,
        });
      }
    }

    // 자격증 저장
    if (certificates) {
      const certArray = JSON.parse(certificates);
      for (const cert of certArray) {
        await Certificate.create({
          resume_id: resume.resume_id,
          certificate_name: cert.certificate_name,
          issued_date: cert.issued_date,
          //issuing_org: cert.issuing_org,
          certificate_number: cert.certificate_number,
        });
      }
    }

    // 기술 저장
    if (skills) {
      const skillArray = JSON.parse(skills);
      for (const skill of skillArray) {
        await Skills.create({
          resume_id: resume.resume_id,
          skill_name: skill,
        });
      }
    }

    // 기타 정보 저장
    if (otherinfo) {
      const etcArray = JSON.parse(otherinfo);
      for (const info of etcArray) {
        await OtherInfo.create({
          resume_id: resume.resume_id,
          content: info,
        });
      }
    }

    // 테스트 결과 저장
    if (companyTest) {
      const companytestObject = JSON.parse(companyTest);

      await CompanyTest.create({
        resume_id: resume.resume_id,
        scores: {
          TeamCulture: companytestObject.TeamCulture,
          Evaluation: companytestObject.Evaluation,
          PayLevel: companytestObject.PayLevel,
          VisionDirection: companytestObject.VisionDirection,
          Welfare: companytestObject.Welfare,
          Workload: companytestObject.Workload,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "이력서 업로드 및 저장 완료",
      resume_id: resume.resume_id,
      filename: filename,
    });
  } catch (err) {
    console.error("업로드 오류:", err);
    return res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};

exports.keywordResume = async (req, res) => {
  const { resume_id } = req.params;

  try {
    // 이력서 정보 조회
    const resume = await Resume.findOne({ resume_id });
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "이력서를 찾을 수 없습니다." });
    }

    // 연관 데이터 가져오기
    const [education, career, certificates, skills, otherinfo] =
      await Promise.all([
        Education.find({ resume_id: resume.resume_id }),
        Career.find({ resume_id: resume.resume_id }),
        Certificate.find({ resume_id: resume.resume_id }),
        Skills.find({ resume_id: resume.resume_id }),
        OtherInfo.find({ resume_id: resume.resume_id }),
      ]);

    // GPT에게 제공할 내용
    let gptInput = `다음은 한 구직자의 이력서 정보입니다. 이 내용을 바탕으로 해당 인재의 특성과 관련된 핵심 키워드 3개를 뽑아주세요.\n\n`;

    gptInput += `■ 기본 정보:\n`;
    gptInput += `나이: ${resume.age}\n`;
    gptInput += `성별: ${resume.gender}\n`;
    gptInput += `현재 연봉: ${resume.current_salary}, 희망 연봉: ${resume.desired_salary}\n\n`;

    gptInput += `■ 학력:\n`;
    education.forEach((edu) => {
      gptInput += `- ${edu.school_name}, 전공: ${edu.major}, 학위: ${edu.degree}, 졸업 여부: ${edu.graduation_status}\n`;
    });

    gptInput += `\n■ 경력:\n`;
    career.forEach((job) => {
      const endYear = job.isCurrent ? "재직중" : job.end_year;
      gptInput += `- ${job.start_year}~${endYear} ${job.company_name}, 직무: ${job.position}, 업무 내용: ${job.description}\n`;
    });

    gptInput += `\n■ 자격증:\n`;
    certificates.forEach((cert) => {
      gptInput += `- ${cert.certificate_name}\n`;
    });

    gptInput += `\n■ Skills:\n`;
    gptInput += skills.map((s) => s.skill_name).join(", ") + "\n";

    gptInput += `\n■ 기타 정보:\n`;
    gptInput += otherinfo.map((o) => `- ${o.content}`).join("\n");

    gptInput += `\n\n출력 형식: ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"]`;

    // GPT에게 요청할 내용
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "너는 후보자의 이력서를 분석하여 핵심 역량과 특성을 요약하는 전문가다.",
        },
        {
          role: "user",
          content: gptInput,
        },
      ],
      temperature: 0.7, // 창의성 ( 1 이상은 창의적, 그 이하는 보수적 )
    });

    const gptResponse = completion.choices[0].message.content;

    // 키워드 추출 (응답이 JSON 형식일 경우)
    let extractedKeywords;
    try {
      extractedKeywords = JSON.parse(gptResponse);
    } catch (e) {
      // fallback: 대괄호 안에서 문자열들만 추출
      extractedKeywords =
        gptResponse.match(/"([^"]+)"/g)?.map((s) => s.replace(/"/g, "")) || [];
    }

    console.log(extractedKeywords);

    // DB 업데이트
    resume.keyword = extractedKeywords;
    await resume.save();

    return res.status(200).json({
      resume_id: resume_id,
      keywords: extractedKeywords,
    });
  } catch (err) {
    console.error("키워드 생성 오류:", err);
    return res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};

exports.downloadResume = async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../pdf/resumes", filename);
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("다운로드 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  });
};

exports.listResume = async (req, res) => {
  try {
    const resumes = await Resume.find(
      {},
      {
        resume_id: 1,
        name: 1,
        age: 1,
        gender: 1,
        address: 1,
        phone: 1,
        current_salary: 1,
        desired_salary: 1,
        keyword: 1,
        filePath: 1,
        _id: 0,
      }
    );

    const fullResumes = await Promise.all(
      resumes.map(async (resume) => {
        const resumeId = resume.resume_id;
        const [
          education,
          career,
          certificates,
          skills,
          otherInfo,
          companyTest,
        ] = await Promise.all([
          Education.find({ resume_id: resumeId }),
          Career.find({ resume_id: resumeId }),
          Certificate.find({ resume_id: resumeId }),
          Skills.find({ resume_id: resumeId }),
          OtherInfo.find({ resume_id: resumeId }),
          CompanyTest.findOne({ resume_id: resumeId }),
        ]);

        return {
          ...resume.toObject(),
          education,
          career,
          certificates,
          skills,
          otherInfo,
          companyTest,
        };
      })
    );

    res.status(200).json(fullResumes);
  } catch (err) {
    console.error("DB 불러오기 오류:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

/*
exports.detaillistResume = async (req, res) => {
  try {
    const resume = await Resume.findOne(
      { resume_id: req.params.resume_id },
      {
        resume_id: 1,
        name: 1,
        age: 1,
        gender: 1,
        keyword: 1,
        filePath: 1,
        _id: 0,
      }
    );

    if (!resume) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다" });
    }

    res.status(200).json(resume);
  } catch (err) {
    console.error("DB 불러오기 오류:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
*/
